
import futurePositionModel, { futurePositionOuput } from "../model/future_position.model";
import futurePositionDto from "../dto/futurePoistion.dto";
import tokensModel from "../model/tokens.model";
import globalTokensModel from "../model/global_token.model";
import futureOpenOrderModel from "../model/future_open_order.model";
import assetModel from "../model/assets.model";
import futurePositionHistoryDto from "../dto/future_position_history.dto";
import futurePositionHistoryModel from "../model/future_position_history.model";
import MarketProfitModel, { MarketProfitInput } from "../model/marketProfit.model";
import userRewardTotalModel from "../model/rewards_total.model";
import { preciseSubtraction, truncateNumber } from "../../utils/utility";
import takeProfitStopLossModel from "../model/takeprofit_stoploss.model";

class futurePositionDal {

    /**
     * return all tokens data
     * @returns
     */
    async all(userid: string): Promise<any> {
        try {
            let trades = await futurePositionModel.findAll({
                where: { user_id: userid, isDeleted: false }, include: [
                    {
                        model: tokensModel
                    },
                    {
                        model: globalTokensModel
                    },
                    {
                        model: futureOpenOrderModel
                    },
                    {
                        model: takeProfitStopLossModel
                    }
                ]
            });
            return trades;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async allByLimit(offset: any, limit: any): Promise<any> {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            let trades = await futurePositionModel.findAll({
                where: { isDeleted: false },
                limit: limits, offset: offsets, include: [
                    {
                        model: tokensModel
                    },
                    {
                        model: globalTokensModel
                    }
                ]
            });
            return trades;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * create new Position
     * @param payload
     * @returns
     */
    async createPosition(payload: futurePositionDto): Promise<futurePositionOuput | any> {
        try {
            // ===============Get Active position================
            let activePosition = await futurePositionModel.findAll({ where: { user_id: payload.user_id, coin_id: payload?.coin_id, status: false, isDeleted: false }, raw: true });
            // ==============Existing active position order==========
            if (activePosition.length > 0) {
                return await this.updateActivePosition(activePosition, payload);
            }
            // ===========create new position=======================
            else {
                return await this.createPositionFunction(payload);
            }
        } catch (error: any) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    //====================================================
    //===============Create New Position =================
    //====================================================
    async createPositionFunction(payload: futurePositionDto) {
        try {
            console.log(payload, '==========db model data');
            //=================== Get Token ==================
            let global_token = await globalTokensModel.findOne({ where: { symbol: 'USDT' }, raw: true });
            let asset: any;
            if (global_token) {
                asset = await assetModel.findOne({ where: { user_id: payload?.user_id, token_id: global_token?.id, walletTtype: 'future_wallet' }, raw: true });
            }


            // get margin of open order by tokenid, userid, status false
            let totalMargin = await futureOpenOrderModel.sum('margin', {
                where: {
                    user_id: payload.user_id,
                    coin_id: global_token?.id,
                    isDeleted: false,
                    status: false,
                }
            });
            
            console.log(totalMargin, "==totalMargin");

            // Get rewards point by userid
            let reward: any = await userRewardTotalModel.findOne({ where: { user_id: payload?.user_id }, raw: true });
            let margin_price: number = payload?.margin;
            let assets_price = 0;
            let reward_point = 0;
            // if assets and rewards point available than order margin divide in assets and rewards point
            if (asset?.balance > 0 && (asset?.balance - totalMargin) > margin_price) {
                if (reward && reward?.amount > 0 && reward?.amount > margin_price / 2) {
                    reward_point = margin_price / 2;
                    assets_price = margin_price / 2
                }
                else {
                    assets_price = margin_price;
                }
            }
            else {
                // assets not available only rewards point available
                if (reward && reward.amount > 0 && reward.amount > margin_price) {
                    reward_point = margin_price;
                }
                // when both assets and rewards not available then return insufficiant balance
                else {
                    return { message: 'Insufficiant Balance' }
                }
            }
            payload.assets_margin = assets_price;
            let res = await futurePositionModel.create(payload);
            if (res) {
                // ================Fee Deduction from user and add to admin=================//
                let futureProfit = 0;
                try {
                    let profit: MarketProfitInput = {
                        source_id: res?.dataValues?.id,
                        total_usdt: 0,
                        paid_usdt: 0,
                        admin_usdt: 0,
                        buyer: res?.dataValues?.user_id,
                        seller: res?.dataValues?.user_id,
                        profit: futureProfit,
                        fees: res?.dataValues?.realized_pnl,
                        coin_type: 'USDT',
                        source_type: 'Future Trading',
                    }
                    await MarketProfitModel.create(profit);
                } catch (error: any) {
                    throw new Error(error.message);
                }
                //================ create position history =================
                let historyBody: futurePositionHistoryDto = {
                    position_id: res?.dataValues?.id,
                    symbol: res?.dataValues?.symbol,
                    user_id: res?.dataValues?.user_id,
                    coin_id: res?.dataValues?.coin_id,
                    market_price: res?.dataValues?.market_price,
                    status: false,
                    direction: res?.dataValues?.direction === 'long' ? 'Open Long' : 'Open Short',
                    order_type: res?.dataValues?.order_type,
                    market_type: res?.dataValues?.market_type,
                    isDeleted: false,
                    qty: res?.dataValues?.qty
                }
                await futurePositionHistoryModel.create(historyBody);
                //================ Update Assets =================
                if (assets_price > 0) {

                    let newbal: number = preciseSubtraction(asset?.balance, Number(Number(assets_price) + Number(payload.realized_pnl)), 6);

                    await assetModel.update({ balance: newbal }, { where: { user_id: payload?.user_id, token_id: global_token?.id, walletTtype: 'future_wallet' } });
                }
                if (reward_point > 0) {
                    let newRewardBal = reward?.amount - (reward_point);
                    await userRewardTotalModel.update({ amount: newRewardBal, order_amount: reward_point }, { where: { user_id: payload.user_id } });
                }
            }
            return res;
        } catch (error: any) {
            console.log(error, '------------');
            throw new Error(error);
        }
    }

    //=======================================================
    //===============Update active Position =================
    //=======================================================
    async updateActivePosition(activePosition: any, payload: futurePositionDto) {
        try {
            console.log('this is working');
            
            let newbal: number = 0;
            //=================== Get Token ==================
            let global_token = await globalTokensModel.findOne({ where: { symbol: 'USDT' }, raw: true });
            let asset: any;
            if (global_token) {
                asset = await assetModel.findOne({ where: { user_id: payload?.user_id, token_id: global_token?.id, walletTtype: 'future_wallet' }, raw: true });
            }

            // get margin of open order by tokenid, userid, status false
            let totalMargin = await futureOpenOrderModel.sum('margin', {
                where: {
                    user_id: payload.user_id,
                    coin_id: global_token?.id,
                    isDeleted: false,
                    status: false,
                }
            });
            // Get rewards point by userid
            let reward: any = await userRewardTotalModel.findOne({ where: { user_id: payload?.user_id }, raw: true });
            let margin_price: number = payload?.margin;
            let assets_price = 0;
            let reward_point = 0;
            // if assets and rewards point available than order margin divide in assets and rewards point
            if (asset?.balance > 0 && (asset?.balance - totalMargin) >= margin_price) {
                if (reward && reward.amount > 0 && reward.amount >= margin_price / 2) {
                    reward_point = margin_price / 2;
                    assets_price = margin_price / 2
                }
                else {
                    assets_price = margin_price;
                }
                console.log('this is working in if');
            }
            else {
                // assets not available only rewards point available
                if (reward && reward.amount > 0 && reward.amount > margin_price) {
                    reward_point = margin_price;
                }
                else {
                    return { message: 'Insufficiant Balance' }
                }
            }
            console.log(activePosition,'this is working in else=======');
            if (activePosition.length > 1) {
                activePosition = activePosition.filter((item: any) => {
                    console.log(item.direction,'this is working in else=======');
                    return item.position_mode === 'Hedge' && item.direction === payload.direction
                })
            }
            activePosition = activePosition[0];
            if (activePosition) {

                console.log(typeof (activePosition.assets_margin), typeof assets_price);

                // ==================Hedge mode==================== //
                if (activePosition?.position_mode === 'Hedge') {
                    console.log("this is in hedge");
                    
                    if (activePosition.direction === payload.direction) {
                        await futurePositionModel.update({
                            qty: activePosition.qty + payload.qty,
                            size: activePosition.size + Number(payload.size),
                            realized_pnl: activePosition.realized_pnl + Number(payload.realized_pnl),
                            entry_price: payload.entry_price,
                            market_price: payload.market_price,
                            margin: activePosition.margin + (payload.margin - payload.realized_pnl),
                            assets_margin: activePosition.assets_margin + Number(assets_price)
                        }, { where: { id: activePosition?.id, direction: payload.direction } });
                        newbal = asset?.balance - (Number(assets_price) + Number(payload.realized_pnl));
                    }
                    else {
                        return await this.createPositionFunction(payload);
                    }
                }
                // ==================One way mode==================
                else if (activePosition?.position_mode === 'oneWay') {
                    console.log("this is in oneWay");
                    if (payload?.direction === activePosition.direction) {
                        let size: any = truncateNumber((activePosition.size + Number(payload?.size)), 5);
                        activePosition.qty = truncateNumber(activePosition.qty + payload.qty, 5);
                        activePosition.realized_pnl = truncateNumber(activePosition.realized_pnl + Number(payload.realized_pnl), 7);
                        activePosition.size = size;
                        activePosition.margin = activePosition.margin + (payload.margin - Number(payload.realized_pnl));
                        activePosition.assets_margin = activePosition.assets_margin + Number(assets_price)
                        newbal = asset?.balance - (Number(assets_price) + Number(payload.realized_pnl));
                    }
                    else {
                        let size: any = truncateNumber(activePosition.size - payload?.size, 5)
                        activePosition.qty = truncateNumber(activePosition.qty - payload.qty, 5);
                        activePosition.realized_pnl = truncateNumber(activePosition.realized_pnl + Number(payload.realized_pnl), 7);
                        activePosition.size = size;
                        activePosition.margin = activePosition.margin - (payload.margin - Number(payload.realized_pnl));
                        activePosition.assets_margin = activePosition.assets_margin + Number(assets_price);
                        newbal = asset?.balance + (Number(assets_price) - Number(payload.realized_pnl));
                    }

                    if (activePosition.qty !== 0) {
                        await futurePositionModel.update({
                            qty: activePosition.qty, size: activePosition.size, realized_pnl: activePosition.realized_pnl,
                            entry_price: payload.entry_price, market_price: payload.market_price, margin: activePosition.margin, assets_margin: activePosition.assets_margin
                        }, { where: { id: activePosition?.id } });
                    }
                    else {
                        newbal = newbal + activePosition.pnl;
                        await futurePositionModel.update({ status: true, isDeleted: true }, { where: { id: activePosition?.id } });
                    }


                }
                //================ Update Assets =================
                await assetModel.update({ balance: newbal }, { where: { user_id: payload?.user_id, token_id: global_token?.id, walletTtype: 'future_wallet' } });

                if (reward_point > 0) {
                    let newRewardBal = reward?.amount - (reward_point);
                    let newOrderAmount = reward?.order_amount + (reward_point);
                    await userRewardTotalModel.update({ amount: newRewardBal, order_amount: newOrderAmount }, { where: { user_id: payload.user_id } });
                }
                // ===============================Fee Deduction=============================//
                let futureProfit = 0;
                try {
                    let profit: MarketProfitInput = {
                        source_id: activePosition?.id,
                        total_usdt: 0,
                        paid_usdt: 0,
                        admin_usdt: 0,
                        buyer: activePosition?.user_id,
                        seller: activePosition?.user_id,
                        profit: futureProfit,
                        fees: payload?.realized_pnl,
                        coin_type: 'USDT',
                        source_type: 'Future Trading',
                    }
                    await MarketProfitModel.create(profit);
                } catch (error: any) {
                    console.log(error, '============errr');
                    throw new Error(error);
                }
                //================ create position history =================
                let historyBody: futurePositionHistoryDto = {
                    position_id: activePosition?.id,
                    symbol: activePosition?.symbol,
                    user_id: activePosition?.user_id,
                    coin_id: activePosition?.coin_id,
                    market_price: activePosition?.market_price,
                    status: false,
                    direction: activePosition?.direction === 'long' ? 'Open Long' : 'Open Short',
                    order_type: activePosition?.order_type,
                    market_type: activePosition?.market_type,
                    isDeleted: false,
                    qty: payload?.qty
                }
                await futurePositionHistoryModel.create(historyBody);
                activePosition = await futurePositionModel.findOne({ where: { user_id: payload.user_id, coin_id: payload?.coin_id, status: false, isDeleted: false }, raw: true });
                return activePosition;
            }

        } catch (error: any) {
            console.log(error, '------------here i am 6');
            throw new Error(error);
        }
    }

    /**
     * Edit Position
     * @param payload 
     * @returns 
     */
    async editPosition(payload: futurePositionDto): Promise<futurePositionOuput | any> {
        try {
            return await futurePositionModel.update(payload, { where: { id: payload.id } });
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * close Position
     */

    async closePosition(id: string, userId: string): Promise<futurePositionOuput | any> {
        try {
            let position = await futurePositionModel.findOne({ where: { id: id }, raw: true });
            if (position) {
                let closeResponse = await futurePositionModel.update({ status: true, queue: true }, { where: { id: id } });
                let global_token = await globalTokensModel.findOne({ where: { symbol: 'USDT' }, raw: true });
                if (global_token) {
                    let asset: any = await assetModel.findOne({ where: { user_id: userId, token_id: global_token?.id, walletTtype: 'future_wallet' }, raw: true });
                    if (asset) {
                        let newBal = 0;
                        // console.log(asset?.balance, '==========assets balance');
                        // console.log(position?.margin, '========user assets value');
                        // console.log(position?.pnl, '===========user profit loss value');
                        // console.log(position?.realized_pnl, '=======position released value');
                        newBal = asset?.balance + position?.margin + preciseSubtraction(position?.pnl ,position?.realized_pnl,10);

                        // console.log(newBal,"=lkjdkjasl");
                        
                        // ================Fee Deduction from user and add to admin=================//
                        let futureProfit = 0;
                        if (position?.pnl < 0) {
                            futureProfit = position?.pnl * -1;
                        }

                        try {
                            let profit: MarketProfitInput = {
                                source_id: position?.id,
                                total_usdt: 0,
                                paid_usdt: 0,
                                admin_usdt: 0,
                                buyer: position?.user_id,
                                seller: position?.user_id,
                                profit: futureProfit,
                                fees: position?.realized_pnl,
                                coin_type: 'USDT',
                                source_type: 'Future Trading',
                            }
                            await MarketProfitModel.create(profit);
                        } catch (error: any) {
                            throw new Error(error.message);
                        }

                        let updateAsset = await assetModel.update({ balance: newBal }, { where: { id: asset?.id } });
                        await futurePositionModel.update({ isDeleted: true }, { where: { id: id } });

                        await futurePositionHistoryModel.update({ status: true }, { where: { position_id: id } });
                        let historyBody: futurePositionHistoryDto = {
                            position_id: position?.id,
                            symbol: position?.symbol,
                            user_id: position?.user_id,
                            coin_id: position?.coin_id,
                            market_price: position?.market_price,
                            status: true,
                            direction: position?.direction === 'long' ? 'Close Long' : 'Close Short',
                            order_type: position?.order_type,
                            market_type: position?.market_type,
                            isDeleted: true,
                            qty: position?.qty
                        }
                        await futurePositionHistoryModel.create(historyBody);
                        return position;
                    }
                }
            }
            else {
                return { "data": null, "message": 'This position order record not found.' }
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async closeAllPosition(userId: string): Promise<futurePositionOuput | any> {
        try {
            let data = [];
            let allPosition = await futurePositionModel.findAll({ where: { user_id: userId, status: false, queue: false }, raw: true });
            for await (let ps of allPosition) {
                let response = await this.closePosition(ps?.id, userId);
                data.push(response);
            }
            if (data.length === allPosition.length) {
                return allPosition;
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Get user position history
     * @param userid 
     * @returns 
     */
    async positionHistory(userid: string): Promise<any> {
        try {
            let trades = await futurePositionHistoryModel.findAll({
                where: { user_id: userid },
                order: [['createdAt', 'DESC']]
            });
            return trades;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async orderbook(coinid: string): Promise<futurePositionOuput | any> {
        try {
            let trades = await futurePositionModel.findAll({
                where: { coin_id: coinid, status: false, isDeleted: false }, order: [['createdAt', 'DESC']], raw: true
            });
            return trades;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

}

export default new futurePositionDal();

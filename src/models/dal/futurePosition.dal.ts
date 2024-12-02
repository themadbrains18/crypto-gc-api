
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
import profitLossDal from "./profitLoss.dal";

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
                        model: takeProfitStopLossModel,
                        where: {
                            isClose: false
                        },
                        required: false // This ensures positions without a takeProfitStopLossModel still appear
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

            // console.log(payload, "=payload");


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
                    coin_id: payload.coin_id,
                    isDeleted: false,
                    status: false,
                }
            });

            // console.log(payload, "==payload");
            // console.log(totalMargin, "total margin");


            // Get rewards point by userid
            let reward: any = await userRewardTotalModel.findOne({ where: { user_id: payload?.user_id }, raw: true });
            let margin_price: number = payload?.margin;
            let assets_price = 0;
            let reward_point = 0;
            // console.log("here", totalMargin);
            // console.log("margin_price", margin_price);
            // console.log(asset?.balance, "=asset?.balance");


            // if assets and rewards point available than order margin divide in assets and rewards point

            // if (asset?.balance > 0 && (asset?.balance - totalMargin) > margin_price) {
            if (asset?.balance > 0 && (asset?.balance > totalMargin)) {

                // console.log("in this condition");

                if (reward && reward?.amount > 0 && reward?.amount > margin_price / 2) {
                    reward_point = margin_price / 2;
                    assets_price = margin_price / 2
                }
                else {
                    assets_price = margin_price;
                }
            }
            else {
                // console.log("in else condition");

                // assets not available only rewards point available
                if (reward && reward.amount > 0 && reward.amount > margin_price) {
                    reward_point = margin_price;
                }
                // when both assets and rewards not available then return insufficiant balance
                else {
                    // console.log("ya yha p");

                    return { message: 'Insufficient balance due to assets being reserved by open orders.' }
                }
            }
            // console.log("yha pahunch gya");

            payload.assets_margin = assets_price;

            // console.log(payload, "===payload");


            let res = await futurePositionModel.create(payload);
            // console.log(res, "==response");
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

                    // console.log("here", assets_price);

                    let newbal: number = preciseSubtraction(asset?.balance, Number(Number(assets_price) + Number(payload.realized_pnl)), 10);
                    // console.log(newbal, "==kjshdkjs");


                    await assetModel.update({ balance: newbal }, { where: { user_id: payload?.user_id, token_id: global_token?.id, walletTtype: 'future_wallet' } });
                }
                if (reward_point > 0) {
                    let newRewardBal = reward?.amount - (reward_point);
                    await userRewardTotalModel.update({ amount: newRewardBal, order_amount: reward_point }, { where: { user_id: payload.user_id } });
                }
            }
            // console.log("in this");

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

            // console.log(payload, '================');
            // return

            let newbal: number = 0;
            //=================== Get Token ==================
            let global_token = await globalTokensModel.findOne({ where: { symbol: 'USDT' }, raw: true });
            let asset: any;
            if (global_token) {
                asset = await assetModel.findOne({ where: { user_id: payload?.user_id, token_id: global_token?.id, walletTtype: 'future_wallet' }, raw: true });
            }

            // console.log(asset,"==asset");


            // get margin of open order by tokenid, userid, status false
            let totalMargin = await futureOpenOrderModel.sum('margin', {
                where: {
                    user_id: payload.user_id,
                    coin_id: payload.coin_id,
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
            }
            else {
                if (reward && reward.amount > 0 && reward.amount > margin_price) {
                    reward_point = margin_price;
                }
                else {
                    return { message: 'Insufficient balance due to assets being reserved by open orders.' }
                }
            }
            if (activePosition.length > 1) {
                activePosition = activePosition.filter((item: any) => {
                    return item.position_mode === 'Hedge' && item.direction === payload.direction
                })
            }
            activePosition = activePosition[0];
            if (activePosition) {
                // ==================Hedge mode==================== //
                if (activePosition?.position_mode === 'Hedge') {
                    if (activePosition.direction === payload.direction) {
                        await futurePositionModel.update({
                            qty: activePosition.qty + payload.qty,
                            size: activePosition.size + Number(payload.size),
                            realized_pnl: activePosition.realized_pnl + Number(payload.realized_pnl),
                            entry_price: payload.entry_price,
                            market_price: payload.market_price,
                            leverage: payload.leverage,
                            margin: activePosition.margin + (payload.margin - payload.realized_pnl),
                            assets_margin: activePosition.assets_margin + Number(assets_price),
                            liq_price: payload?.liq_price
                        }, { where: { id: activePosition?.id, direction: payload.direction } });
                        newbal = asset?.balance - (Number(assets_price) + Number(payload.realized_pnl));
                    }
                    else {
                        return await this.createPositionFunction(payload);
                    }
                }
                // ==================One way mode==================
                else if (activePosition?.position_mode === 'oneWay') {
                    if (payload?.direction === activePosition.direction) {
                        let size: any = truncateNumber((activePosition.size + Number(payload?.size)), 5);
                        activePosition.qty = truncateNumber(activePosition.qty + payload.qty, 5);
                        activePosition.realized_pnl = truncateNumber(activePosition.realized_pnl + Number(payload.realized_pnl), 7);
                        activePosition.size = size;
                        activePosition.leverage = payload.leverage;
                        activePosition.margin = activePosition.margin + (payload.margin - Number(payload.realized_pnl));
                        activePosition.assets_margin = activePosition.assets_margin + Number(assets_price);
                        activePosition.liq_price = payload?.liq_price;
                        newbal = asset?.balance - (Number(assets_price) + Number(payload.realized_pnl));
                    }
                    else {
                        if (payload.leverage && activePosition?.leverage > payload?.leverage) {
                            return { message:"The leverage in the active position is greater than the provided leverage. Please ensure the payload leverage is higher or equal to the active position leverage."};
                        }
                        
                        let size: any = activePosition.qty > payload.qty ? preciseSubtraction(activePosition.size, payload?.size, 10) : preciseSubtraction(payload?.size, activePosition.size, 10);
                        activePosition.realized_pnl = truncateNumber(activePosition.realized_pnl + Number(payload.realized_pnl), 7);
                        activePosition.size = size;
                        activePosition.leverage = payload.leverage;
                        let new_margin = preciseSubtraction(payload.margin, Number(payload.realized_pnl), 10)
                        activePosition.margin = activePosition.qty > payload.qty ? preciseSubtraction(activePosition.margin, new_margin, 10) : preciseSubtraction(new_margin, activePosition.margin, 10);
                        activePosition.assets_margin = activePosition.qty > payload.qty ? preciseSubtraction(activePosition.assets_margin, Number(assets_price), 10) : preciseSubtraction(Number(assets_price), activePosition.assets_margin, 10);
                        activePosition.direction = activePosition.qty > payload.qty ? activePosition.direction : payload.direction
                        activePosition.liq_price = activePosition.qty > payload.qty ? activePosition.liq_price : payload?.liq_price;

                        console.log(activePosition, '======margin');
                        if (activePosition.qty > payload.qty) {
                            // console.log("here 1");
                            newbal = asset?.balance + Number(activePosition.margin) + Number(payload.realized_pnl)
                            // console.log(newbal,"==new balance"
                        }
                        if (activePosition.qty < payload.qty) {
                            newbal = asset?.balance + Number(payload.realized_pnl)

                            //     console.log("here 2");
                            //     let subtractBalance = Number(activePosition.margin) + Number(payload.realized_pnl);
                            //     newbal=preciseSubtraction(asset?.balance, subtractBalance, 10);
                            //     console.log("new balace 2", newbal);
                        }

                        if (activePosition.qty == payload.qty) {
                            console.log("in this");
                            
                            newbal = asset?.balance+new_margin+activePosition?.pnl
                        }

                        activePosition.qty = Math.abs(preciseSubtraction(activePosition.qty, payload.qty, 10));

                        activePosition.qty = truncateNumber(activePosition.qty, 4)

                        // console.log(payload.margin, '====== payload margin');
                        // subtractBalance = Number(activePosition.margin) + Number(payload.realized_pnl);
                        // // console.log(subtractBalance, '=========subtractBalance');
                        // // console.log(asset?.balance,"==asset?.balance");
                        // newbal = preciseSubtraction(asset?.balance, subtractBalance, 10);

                        // console.log(newbal,'===before');
                    }
     
                    if (activePosition.qty !== 0) {
                        await futurePositionModel.update({
                            qty: activePosition.qty,
                            size: activePosition.size,
                            realized_pnl: activePosition.realized_pnl,
                            leverage: payload.leverage,
                            entry_price: payload.entry_price,
                            market_price: payload.market_price,
                            margin: activePosition.margin,
                            assets_margin: activePosition.assets_margin,
                            direction: activePosition.direction,
                            liq_price: activePosition.liq_price
                        }, { where: { id: activePosition?.id } });
                    }
                    else {
                        newbal = newbal + activePosition.pnl;
                        await takeProfitStopLossModel.update({ isClose: true }, { where: { position_id: activePosition?.id } });
                        await futurePositionModel.update({ status: true, isDeleted: true }, { where: { id: activePosition?.id } });
                    }
                }
                //================ Update Assets =================
                console.log(newbal, '=========update new balnce', activePosition.margin, '=======position margin', asset?.balance);

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
                let global_coin = await globalTokensModel.findOne({ where: { id: position?.coin_id }, raw: true });
                if (global_token) {
                    let asset: any = await assetModel.findOne({ where: { user_id: userId, token_id: global_token?.id, walletTtype: 'future_wallet' }, raw: true });
                    if (asset) {
                        let newBal = 0;
                        console.log("hererererer");
                        
                        // console.log(global_token.price <= position.liq_price,"=============globaltoken");
                        // console.log(global_token.price ,"global_token.price ");
                        // console.log(position.liq_price ,"position.liq_price");
                        
                        if (global_coin && position?.direction === 'long' && global_coin.price <= position.liq_price) {
                            // newBal = preciseSubtraction(asset?.balance, position?.realized_pnl, 10);
                            newBal = asset?.balance;
                            // console.log(newBal,"===balance 1 long");
                        }
                        else if (global_coin && position?.direction === 'short' && global_coin.price >= position.liq_price) {
                            // newBal = preciseSubtraction(asset?.balance, position?.realized_pnl, 10);
                            newBal = asset?.balance;
                            // console.log(newBal,"===balance 2 short" );
                        }
                        else {
                            // newBal = asset?.balance + position?.margin + preciseSubtraction(position?.pnl, position?.realized_pnl, 10);
                            newBal = asset?.balance + position?.margin + position?.pnl;
                            console.log(newBal,'==================newBal default case');
                        }

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
                        await profitLossDal.close(id, userId)
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
                        await takeProfitStopLossModel.update({ isClose: true }, { where: { position_id: id } });

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

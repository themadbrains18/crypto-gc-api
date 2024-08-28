
import service from "../../services/service";
import { assetsWalletType, marketCancel, marketOrderEnum, marketPartialExecution, tokenTypeEnum, marektTypeEnum } from "../../utils/interface";
import { marketDto } from "../dto/market.dto";
import assetModel from "../model/assets.model";
import marketOrderHistoryModel, { marketOrderHistoryInput } from "../model/marketOrderHistory.model";
import marketOrderModel, { marketOrderOuput } from "../model/marketorder.model";
import userDal from "./users.dal";
import tokensModel from "../model/tokens.model";
import MarketProfitModel, { MarketProfitInput } from "../model/marketProfit.model";
import globalTokensModel from "../model/global_token.model";
import sequelize from '../index';
import { preciseSubtraction, truncateNumber } from "../../utils/utility";
import { Op } from "sequelize";

class marketDal {

    /**
     * 
     * @param payload 
     * @returns 
     */
    async create(payload: marketDto): Promise<marketOrderOuput | any> {
        try {

            let userService = new userDal();
            let user = await userService.checkUserByPk(payload.user_id);

            if (user != null) {
                if (payload.order_type === marketOrderEnum.sell) {

                    let assets = await assetModel.findOne({ where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: assetsWalletType.main_wallet }, raw: true });

                    if (assets && assets?.balance > 0 && assets?.balance >= payload?.token_amount) {
                        let marketresult = await marketOrderModel.create(payload);
                        let result: any = marketresult.dataValues;
                        if (result) {

                            let history: marketOrderHistoryInput = {
                                order_id: result.id,
                                user_id: payload.user_id,
                                token_id: payload.token_id,
                                order_type: payload.order_type,
                                market_type: payload.market_type,
                                token_amount: payload.token_amount,
                                limit_usdt: payload.limit_usdt,
                                volume_usdt: payload.volume_usdt,
                                isCanceled: payload.isCanceled,
                                status: payload.status,
                                entry_id: 0
                            }
                            let historyResult = await marketOrderHistoryModel.create(history);

                            // let new_bal = truncateNumber(assets.balance - payload.token_amount, 8);
                            let new_bal = preciseSubtraction(assets.balance, payload.token_amount, 10);
                            let assetUpdate = await assetModel.update({ balance: new_bal }, { where: { id: assets.id } });

                            return result;
                        }
                    }
                    else {
                        throw new Error('You have insufficient balance!.');
                    }
                }
                if (payload.order_type === marketOrderEnum.buy) {

                    let token = await tokensModel.findOne({ where: { symbol: 'USDT' }, raw: true });
                    if (!token) {
                        token = await globalTokensModel.findOne({ where: { symbol: 'USDT' }, raw: true });
                    }
                    let assets = await assetModel.findOne({ where: { user_id: payload.user_id, token_id: token?.id, walletTtype: assetsWalletType.main_wallet }, raw: true });
                    if (assets && assets?.balance > 0 && assets?.balance >= payload?.volume_usdt) {
                        let marketresult = await marketOrderModel.create(payload);
                        let result: any = marketresult.dataValues;
                        if (result) {

                            let history: marketOrderHistoryInput = {
                                order_id: result.id,
                                user_id: payload.user_id,
                                token_id: payload.token_id,
                                order_type: payload.order_type,
                                market_type: payload.market_type,
                                token_amount: payload.token_amount,
                                limit_usdt: payload.limit_usdt,
                                volume_usdt: payload.volume_usdt,
                                isCanceled: payload.isCanceled,
                                status: payload.status,
                                entry_id: 0
                            }
                            let historyResult = await marketOrderHistoryModel.create(history);

                            // let new_bal = truncateNumber(assets.balance - payload.volume_usdt, 8);
                            let new_bal = preciseSubtraction(assets.balance, payload.volume_usdt, 10);
                            let assetUpdate = await assetModel.update({ balance: new_bal }, { where: { id: assets.id } });

                            return result;
                        }
                    }
                    else {
                        throw new Error('You have insufficient balance!.')
                    }
                }
            }
            else {
                throw new Error('User not exist');
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }


    /**
     * 
     * @param userid 
     * @returns 
     */
    async getOrderList(userid: string): Promise<marketOrderOuput | any> {
        try {
            return await marketOrderModel.findAll({
                where: { user_id: userid },
                include: [
                    {
                        model: tokensModel
                    },
                    {
                        model: globalTokensModel
                    },
                    {
                        model: marketOrderHistoryModel,
                    }
                ], order: [['createdAt', 'ASC']]
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * 
     * @param userid by limit
     * @returns 
     */
    async getOrderListByLimit(userid: string, offset: string, limit: string, currency: string, date: string): Promise<marketOrderOuput | any> {
        try {
            let offsets = parseInt(offset)
            let limits = parseInt(limit)
            let whereClause: any = {
                user_id: userid
            };
            if (currency && currency !== 'all') {
                whereClause.token_id = currency;
            }
            if (date && date !== "all") {
                whereClause.createdAt = {
                    [Op.gte]: new Date(date as string) // Filter posts from the given date
                };
            }
           let data=  await marketOrderModel.findAll({
                where: whereClause,
                include: [
                    {
                        model: tokensModel
                    },
                    {
                        model: globalTokensModel
                    },
                    {
                        model: marketOrderHistoryModel,
                    }
                ], order: [['createdAt', 'ASC']],
          
            });
            const totalLength = data.length;
    
            // Paginate the filtered records
            const paginatedData = data.slice(offsets, offsets + limits);
    
            return { data: paginatedData, total: totalLength };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    /**
     * 
     * @param payload 
     * @returns 
     */
    async cancelOrder(payload: marketCancel): Promise<marketOrderOuput | any> {
        try {
            let userService = new userDal();
            let user = await userService.checkUserByPk(payload.user_id);
            if (user) {
                let order = await service.market.getMarketOrderById(payload.order_id);
                if (order) {
                    let mainBalance;
                    let balance = order.token_amount;

                    let assets = await assetModel.findOne({ where: { user_id: payload.user_id, token_id: order.token_id, walletTtype: assetsWalletType.main_wallet }, raw: true });

                    // let userAsset = assets?.dataValues;

                    let count: any = await marketOrderHistoryModel.findAll({
                        attributes: [[sequelize.fn('max', sequelize.col('entry_id')), 'max']],
                        raw: true,
                        where: {
                            order_id: order.id,
                            user_id: payload.user_id,
                            token_id: order.token_id
                        }
                    })

                    let history: marketOrderHistoryInput = {
                        order_id: order.id,
                        user_id: payload.user_id,
                        token_id: order.token_id,
                        order_type: order.order_type,
                        market_type: order.market_type,
                        token_amount: order.token_amount,
                        limit_usdt: order.limit_usdt,
                        volume_usdt: order.volume_usdt,
                        isCanceled: true,
                        status: order.status,
                        entry_id: count[0].max + 1
                    }

                    if (assets) {
                        mainBalance = assets?.balance;
                    }

                    if (order.order_type === marketOrderEnum.buy) {

                        balance = order.volume_usdt;
                        let token = await globalTokensModel.findOne({ where: { symbol: 'USDT' }, raw: true });
                        assets = await assetModel.findOne({ where: { user_id: payload.user_id, walletTtype: assetsWalletType.main_wallet, token_id: token?.id }, raw: true });

                        if (assets) {
                            mainBalance = assets?.balance;
                        }
                    }

                    if (assets) {
                        await marketOrderHistoryModel.create(history);
                        let assetUpdate = await assetModel.update({ balance: balance + mainBalance }, { where: { id: assets.id } });
                        await marketOrderModel.update({ isCanceled: true }, { where: { id: payload.order_id } });
                        return await marketOrderModel.findAll({ where: { user_id: payload.user_id, token_id: order.token_id, status: false, isCanceled: false } });
                    }
                }
                else {
                    return order;
                }
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * 
     * @param token_id 
     * @returns 
     */
    async getOrderListByTokenId(token_id: string): Promise<marketOrderOuput | any> {
        try {
            let token = await tokensModel.findOne({ where: { id: token_id }, raw: true });
            let globalToken: any = await globalTokensModel.findOne({ where: { id: token_id }, raw: true });
            let orderAll = await marketOrderModel.findAll({
                where: { token_id, status: false, isCanceled: false }, include: [
                    {
                        model: token !== null ? tokensModel : globalTokensModel
                    }, {
                        model: marketOrderHistoryModel,
                    }
                ], order: [['createdAt', 'ASC']]
            });

            let chartData = await this.marketChartData(token !== null ? token.id : globalToken.id);

            return { orderAll, hloc: chartData }
            // res.send({ status: 200, data: { record, hloc: chartData } })
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async marketChartData(tokenid: string) {
        try {

            if (tokenid === undefined) return
            let data = await sequelize.query(`SELECT DATE(createdAt) AS time, max(limit_usdt) AS high, min(limit_usdt) AS low,
          CAST(SUBSTRING_INDEX(MIN(CONCAT(createdAt, '_', limit_usdt)), '_', -1) as double)  as open,
            CAST( SUBSTRING_INDEX(MAX(CONCAT(createdAt, '_', limit_usdt)), '_', -1)as double) AS close
          FROM marketorders AS marketorder where  token_id='${tokenid}' GROUP BY time`);

            // let volume24:any = await sequelize.query(`select SUM(volume_usdt) as Volume from marketorders where createdAt > (select createdAt from marketorders order by id desc limit 1) - interval 24 hour;`);

            let hloc = [];
            for (const a of data) {
                let internal: any = a;
                for (const item of internal) {
                    let arrray = [new Date(item.time).getTime(), item.high, item.low, item.open, item.close];
                    hloc.push(arrray);
                }
            }
            // const updatedArray = data.map((obj:any) => ({ ...obj}))
            return hloc;

        } catch (error: any) {
            console.log(error)
            throw new Error(error.message)
        }
    }

    /**
     * 
     * @param token_id 
     * @param user_id 
     * @returns 
     */
    async getOrderListByTokenIdUserId(token_id: string, user_id: string): Promise<marketOrderOuput | any> {
        try {
            let token = await tokensModel.findOne({ where: { id: token_id }, raw: true });
            // let globalToken = await globalTokensModel.findOne({where : {id : token_id}, raw : true});
            return await marketOrderModel.findAll({
                where: { token_id, user_id, status: false, isCanceled: false },
                include: [
                    {
                        model: token !== null ? tokensModel : globalTokensModel
                    }, {
                        model: marketOrderHistoryModel,
                    }
                ],
                order: [['createdAt', 'ASC']]
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * 
     * @param token_id 
     * @param user_id 
     * @returns 
     */
    async getOrderHistoryByTokenIdUserId(token_id: string, user_id: string): Promise<marketOrderOuput | any> {
        try {
            let token = await tokensModel.findOne({ where: { id: token_id }, raw: true });
            // let globalToken = await globalTokensModel.findOne({where : {id : token_id}, raw : true});
            return await marketOrderModel.findAll({
                where: { token_id, user_id },
                include: [
                    {
                        model: tokensModel
                    },
                    {
                        model: globalTokensModel
                    },
                    {
                        model: marketOrderHistoryModel,
                    }
                ],
                order: [['createdAt', 'ASC']]
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * 
     * @param payload 
     */
    async socketMarketBuySell(payload: marketPartialExecution): Promise<any> {
        try {
            // console.log('========here 1', payload);
            let activeOrder = await marketOrderModel.findAll({ where: { status: false, isCanceled: false, token_id: payload?.token_id }, raw: true, order: [['createdAt', "DESC"]] });
            // console.log(activeOrder,"=========activeOrder");
            // return;
            
            if (activeOrder) {

                //============================================================================//
                //=============Market Based spot market order partial execution===============//
                //============================================================================//
                if (payload?.market_type === marektTypeEnum.market) {
                    let marketRequest = activeOrder.filter((item) => {
                        return item.market_type === marektTypeEnum.market
                    })

                    if (marketRequest.length > 0) {
                        // buySellOnMarketPrice(marketRequest, token, wss, ws);
                        let marketbuysell = await service.market.buySellOnMarket(payload);
                    }
                }

                //===========================================================================//
                //=============Limit Based spot market order partial execution===============//
                //===========================================================================//
                if (payload?.market_type === marektTypeEnum.limit) {
                    let limitRequest = activeOrder.filter((item: any) => {
                        return item?.market_type === marektTypeEnum.limit
                    })
                    if (limitRequest.length > 0) {
                        let buylimit = await service.market.buySellOnLimit(payload);
                    }
                }
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * 
     * @param buyerObj 
     * @param paid_usdt 
     * @param paid_to_admin 
     * @param seller 
     */
    async createAdminProfit(buyerObj: any, paid_usdt: any, paid_to_admin: any, seller: any, fee: number, coin_type: string, source_type: string) {
        try {
            let profit: MarketProfitInput = {
                source_id: buyerObj.id,
                total_usdt: (buyerObj.limit_usdt * buyerObj.token_amount),
                paid_usdt: paid_usdt,
                admin_usdt: paid_to_admin,
                buyer: buyerObj.user_id,
                seller: seller,
                profit: paid_to_admin,
                fees: fee,
                coin_type: coin_type,
                source_type: source_type,
            }
            await MarketProfitModel.create(profit);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * 
     * @param order 
     * @param token_amount 
     * @param paid_usdt 
     */
    async createMarketOrderHistory(order: any, token_amount: number, paid_usdt: number) {
        try {

            let count: any = await marketOrderHistoryModel.findAll({
                attributes: [[sequelize.fn('max', sequelize.col('entry_id')), 'max']],
                raw: true,
                where: {
                    order_id: order.id,
                    user_id: order.user_id,
                    token_id: order.token_id
                }
            })

            let sellerhistory: marketOrderHistoryInput = {
                order_id: order.id,
                user_id: order.user_id,
                token_id: order.token_id,
                order_type: order.order_type,
                market_type: order.market_type,
                token_amount: token_amount,
                limit_usdt: order.limit_usdt,
                volume_usdt: paid_usdt,
                isCanceled: false,
                status: true,
                entry_id: count[0].max + 1
            }
            await marketOrderHistoryModel.create(sellerhistory);
            // console.log(count[0].max + 1, '----after order execute');

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * 
     */
    async getMarketOrderList(): Promise<marketOrderOuput | any> {
        try {
            return await marketOrderModel.findAll({
                include: [{
                    model: tokensModel
                }, {
                    model: globalTokensModel
                }],
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * 
     */
    async getMarketOrderListByLimit(offset: string, limit: string): Promise<marketOrderOuput | any> {
        try {
            let offsets = parseInt(offset)
            let limits = parseInt(limit)
            return await marketOrderModel.findAll({
                include: [{
                    model: tokensModel
                }, {
                    model: globalTokensModel
                }],
                limit: limits,
                offset: offsets
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default new marketDal();
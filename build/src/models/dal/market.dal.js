"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../../services/service"));
const interface_1 = require("../../utils/interface");
const assets_model_1 = __importDefault(require("../model/assets.model"));
const marketOrderHistory_model_1 = __importDefault(require("../model/marketOrderHistory.model"));
const marketorder_model_1 = __importDefault(require("../model/marketorder.model"));
const users_dal_1 = __importDefault(require("./users.dal"));
const tokens_model_1 = __importDefault(require("../model/tokens.model"));
const marketProfit_model_1 = __importDefault(require("../model/marketProfit.model"));
const global_token_model_1 = __importDefault(require("../model/global_token.model"));
const index_1 = __importDefault(require("../index"));
class marketDal {
    /**
     *
     * @param payload
     * @returns
     */
    async create(payload) {
        try {
            let userService = new users_dal_1.default();
            let user = await userService.checkUserByPk(payload.user_id);
            if (user != null) {
                if (payload.order_type === interface_1.marketOrderEnum.sell) {
                    let assets = await assets_model_1.default.findOne({ where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: interface_1.assetsWalletType.main_wallet }, raw: true });
                    if (assets && assets?.balance > 0 && assets?.balance >= payload?.token_amount) {
                        let marketresult = await marketorder_model_1.default.create(payload);
                        let result = marketresult.dataValues;
                        if (result) {
                            let history = {
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
                            };
                            let historyResult = await marketOrderHistory_model_1.default.create(history);
                            console.log('------here order history create first time');
                            let new_bal = assets.balance - payload.token_amount;
                            let assetUpdate = await assets_model_1.default.update({ balance: new_bal }, { where: { id: assets.id } });
                            return result;
                        }
                    }
                    else {
                        throw new Error('You have unsufficiant balance!.');
                    }
                }
                if (payload.order_type === interface_1.marketOrderEnum.buy) {
                    let token = await tokens_model_1.default.findOne({ where: { symbol: 'USDT' }, raw: true });
                    if (!token) {
                        token = await global_token_model_1.default.findOne({ where: { symbol: 'USDT' }, raw: true });
                    }
                    let assets = await assets_model_1.default.findOne({ where: { user_id: payload.user_id, token_id: token?.id, walletTtype: interface_1.assetsWalletType.main_wallet }, raw: true });
                    if (assets && assets?.balance > 0 && assets?.balance >= payload?.volume_usdt) {
                        let marketresult = await marketorder_model_1.default.create(payload);
                        let result = marketresult.dataValues;
                        if (result) {
                            let history = {
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
                            };
                            let historyResult = await marketOrderHistory_model_1.default.create(history);
                            console.log('------here order history create first time');
                            let new_bal = assets.balance - payload.volume_usdt;
                            let assetUpdate = await assets_model_1.default.update({ balance: new_bal }, { where: { id: assets.id } });
                            return result;
                        }
                    }
                    else {
                        throw new Error('You have unsufficiant balance!.');
                    }
                }
            }
            else {
                throw new Error('User not exist');
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     *
     * @param userid
     * @returns
     */
    async getOrderList(userid) {
        try {
            return await marketorder_model_1.default.findAll({
                where: { user_id: userid },
                include: [
                    {
                        model: tokens_model_1.default
                    },
                    {
                        model: global_token_model_1.default
                    },
                    {
                        model: marketOrderHistory_model_1.default,
                    }
                ], order: [['createdAt', 'ASC']]
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     *
     * @param userid by limit
     * @returns
     */
    async getOrderListByLimit(userid, offset, limit) {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            return await marketorder_model_1.default.findAll({
                where: { user_id: userid },
                include: [
                    {
                        model: tokens_model_1.default
                    },
                    {
                        model: global_token_model_1.default
                    },
                    {
                        model: marketOrderHistory_model_1.default,
                    }
                ], order: [['createdAt', 'ASC']],
                offset: offsets,
                limit: limits
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     *
     * @param payload
     * @returns
     */
    async cancelOrder(payload) {
        try {
            let userService = new users_dal_1.default();
            let user = await userService.checkUserByPk(payload.user_id);
            if (user) {
                let order = await service_1.default.market.getMarketOrderById(payload.order_id);
                if (order) {
                    let mainBalance;
                    let balance = order.token_amount;
                    let assets = await assets_model_1.default.findOne({ where: { user_id: payload.user_id, token_id: order.token_id, walletTtype: interface_1.assetsWalletType.main_wallet }, raw: true });
                    // let userAsset = assets?.dataValues;
                    let count = await marketOrderHistory_model_1.default.findAll({
                        attributes: [[index_1.default.fn('max', index_1.default.col('entry_id')), 'max']],
                        raw: true,
                        where: {
                            order_id: order.id,
                            user_id: payload.user_id,
                            token_id: order.token_id
                        }
                    });
                    let history = {
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
                    };
                    if (assets) {
                        mainBalance = assets?.balance;
                    }
                    if (order.order_type === interface_1.marketOrderEnum.buy) {
                        balance = order.volume_usdt;
                        let token = await global_token_model_1.default.findOne({ where: { symbol: 'USDT' }, raw: true });
                        assets = await assets_model_1.default.findOne({ where: { user_id: payload.user_id, walletTtype: interface_1.assetsWalletType.main_wallet, token_id: token?.id }, raw: true });
                        if (assets) {
                            mainBalance = assets?.balance;
                        }
                    }
                    if (assets) {
                        await marketOrderHistory_model_1.default.create(history);
                        // console.log(count[0].max + 1,'----after order cancel');
                        let assetUpdate = await assets_model_1.default.update({ balance: balance + mainBalance }, { where: { id: assets.id } });
                        await marketorder_model_1.default.update({ isCanceled: true }, { where: { id: payload.order_id } });
                        return await marketorder_model_1.default.findAll({ where: { user_id: payload.user_id, token_id: order.token_id, status: false, isCanceled: false } });
                    }
                }
                else {
                    return order;
                }
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     *
     * @param token_id
     * @returns
     */
    async getOrderListByTokenId(token_id) {
        try {
            let token = await tokens_model_1.default.findOne({ where: { id: token_id }, raw: true });
            let globalToken = await global_token_model_1.default.findOne({ where: { id: token_id }, raw: true });
            let orderAll = await marketorder_model_1.default.findAll({
                where: { token_id, status: false, isCanceled: false }, include: [
                    {
                        model: token !== null ? tokens_model_1.default : global_token_model_1.default
                    }, {
                        model: marketOrderHistory_model_1.default,
                    }
                ], order: [['createdAt', 'ASC']]
            });
            let chartData = await this.marketChartData(token !== null ? token.id : globalToken.id);
            return { orderAll, hloc: chartData };
            // res.send({ status: 200, data: { record, hloc: chartData } })
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async marketChartData(tokenid) {
        try {
            if (tokenid === undefined)
                return;
            let data = await index_1.default.query(`SELECT DATE(createdAt) AS time, max(limit_usdt) AS high, min(limit_usdt) AS low,
          CAST(SUBSTRING_INDEX(MIN(CONCAT(createdAt, '_', limit_usdt)), '_', -1) as double)  as open,
            CAST( SUBSTRING_INDEX(MAX(CONCAT(createdAt, '_', limit_usdt)), '_', -1)as double) AS close
          FROM marketorders AS marketorder where  token_id='${tokenid}' GROUP BY time`);
            // let volume24:any = await sequelize.query(`select SUM(volume_usdt) as Volume from marketorders where createdAt > (select createdAt from marketorders order by id desc limit 1) - interval 24 hour;`);
            let hloc = [];
            for (const a of data) {
                let internal = a;
                for (const item of internal) {
                    let arrray = [new Date(item.time).getTime(), item.high, item.low, item.open, item.close];
                    hloc.push(arrray);
                }
            }
            // const updatedArray = data.map((obj:any) => ({ ...obj}))
            return hloc;
        }
        catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    /**
     *
     * @param token_id
     * @param user_id
     * @returns
     */
    async getOrderListByTokenIdUserId(token_id, user_id) {
        try {
            let token = await tokens_model_1.default.findOne({ where: { id: token_id }, raw: true });
            // let globalToken = await globalTokensModel.findOne({where : {id : token_id}, raw : true});
            return await marketorder_model_1.default.findAll({
                where: { token_id, user_id, status: false, isCanceled: false },
                include: [
                    {
                        model: token !== null ? tokens_model_1.default : global_token_model_1.default
                    }, {
                        model: marketOrderHistory_model_1.default,
                    }
                ],
                order: [['createdAt', 'ASC']]
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     *
     * @param token_id
     * @param user_id
     * @returns
     */
    async getOrderHistoryByTokenIdUserId(token_id, user_id) {
        try {
            let token = await tokens_model_1.default.findOne({ where: { id: token_id }, raw: true });
            // let globalToken = await globalTokensModel.findOne({where : {id : token_id}, raw : true});
            return await marketorder_model_1.default.findAll({
                where: { token_id, user_id },
                include: [
                    {
                        model: tokens_model_1.default
                    },
                    {
                        model: global_token_model_1.default
                    },
                    {
                        model: marketOrderHistory_model_1.default,
                    }
                ],
                order: [['createdAt', 'ASC']]
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     *
     * @param payload
     */
    async socketMarketBuySell(payload) {
        try {
            console.log('========here 1');
            let activeOrder = await marketorder_model_1.default.findAll({ where: { status: false, isCanceled: false, token_id: payload?.token_id }, raw: true, order: [['id', "DESC"]] });
            if (activeOrder) {
                //============================================================================//
                //=============Market Based spot market order partial execution===============//
                //============================================================================//
                let marketRequest = activeOrder.filter((item) => {
                    return item.market_type === interface_1.marektTypeEnum.market;
                });
                if (marketRequest.length > 0) {
                    // buySellOnMarketPrice(marketRequest, token, wss, ws);
                    let marketbuysell = await service_1.default.market.buySellOnMarket(payload);
                }
                //===========================================================================//
                //=============Limit Based spot market order partial execution===============//
                //===========================================================================//
                let limitRequest = activeOrder.filter((item) => {
                    return item?.market_type === interface_1.marektTypeEnum.limit;
                });
                if (limitRequest.length > 0) {
                    let buylimit = await service_1.default.market.buySellOnLimit(payload);
                }
            }
        }
        catch (error) {
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
    async createAdminProfit(buyerObj, paid_usdt, paid_to_admin, seller, fee, coin_type, source_type) {
        try {
            let profit = {
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
            };
            await marketProfit_model_1.default.create(profit);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     *
     * @param order
     * @param token_amount
     * @param paid_usdt
     */
    async createMarketOrderHistory(order, token_amount, paid_usdt) {
        try {
            let count = await marketOrderHistory_model_1.default.findAll({
                attributes: [[index_1.default.fn('max', index_1.default.col('entry_id')), 'max']],
                raw: true,
                where: {
                    order_id: order.id,
                    user_id: order.user_id,
                    token_id: order.token_id
                }
            });
            let sellerhistory = {
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
            };
            await marketOrderHistory_model_1.default.create(sellerhistory);
            console.log(count[0].max + 1, '----after order execute');
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     *
     */
    async getMarketOrderList() {
        try {
            return await marketorder_model_1.default.findAll({
                include: [{
                        model: tokens_model_1.default
                    }, {
                        model: global_token_model_1.default
                    }],
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     *
     */
    async getMarketOrderListByLimit(offset, limit) {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            return await marketorder_model_1.default.findAll({
                include: [{
                        model: tokens_model_1.default
                    }, {
                        model: global_token_model_1.default
                    }],
                limit: limits,
                offset: offsets
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = new marketDal();

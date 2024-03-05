"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const futureOpenOrder_dal_1 = __importDefault(require("../models/dal/futureOpenOrder.dal"));
const future_open_order_model_1 = __importDefault(require("../models/model/future_open_order.model"));
const service_1 = __importDefault(require("./service"));
const marketProfit_model_1 = __importDefault(require("../models/model/marketProfit.model"));
class futureOpenOrderServices {
    /**
     *
     * @returns return all published token
     */
    async all(userid) {
        return await futureOpenOrder_dal_1.default.all(userid);
    }
    async allByLimit(offset, limit) {
        return await futureOpenOrder_dal_1.default.allByLimit(offset, limit);
    }
    /**
     *
     * @param payload
     * @returns
     */
    async create(payload) {
        return await futureOpenOrder_dal_1.default.createOpenOrder(payload);
    }
    /**
     *
     * @param payload
     * @returns
     */
    async edit(payload) {
        return await futureOpenOrder_dal_1.default.editOpenOrder(payload);
    }
    /**
     * Close Open Order by id
     * @param payload
     * @param userId
     * @returns
     */
    async closeOpenOrderById(payload, userId) {
        return await futureOpenOrder_dal_1.default.closeOpenOrderById(payload, userId);
    }
    async openOrderCron() {
        try {
            // console.log('============cron limit order');
            let allTokens = await service_1.default.token.all();
            let openOrders = await future_open_order_model_1.default.findAll({ where: { status: false, isDeleted: false, type: 'limit' }, raw: true });
            if (openOrders) {
                for await (const oo of openOrders) {
                    let token = allTokens.filter((t) => {
                        return t?.dataValues?.id === oo?.coin_id;
                    });
                    let tt = token[0]?.dataValues;
                    if (Math.round(tt.price) === Math.round(oo.price_usdt)) {
                        let value = (oo.qty * 0.02).toFixed(5);
                        let releazedPnl = ((oo.price_usdt * value) / 100);
                        let body = {
                            symbol: oo.symbol,
                            coin_id: oo.coin_id,
                            user_id: oo.user_id,
                            entry_price: oo.price_usdt,
                            leverage: oo.leverage,
                            leverage_type: oo.leverage_type,
                            liq_price: oo.liq_price,
                            queue: false,
                            status: false,
                            size: parseFloat(oo.amount),
                            margin: oo.margin - releazedPnl,
                            market_price: oo.market_price,
                            tp_sl: '--',
                            market_type: 'limit',
                            order_type: oo.order_type,
                            pnl: 0.00,
                            realized_pnl: releazedPnl,
                            margin_ratio: 0.01,
                            direction: oo.side === 'open long' ? 'long' : 'short',
                            qty: oo.qty,
                            assets_margin: oo.margin - releazedPnl
                        };
                        let create = await models_1.futurePositionModel.create(body);
                        if (create) {
                            await future_open_order_model_1.default.update({ status: true, isDeleted: false }, { where: { id: oo.id } });
                            // =========================================================//
                            // ================Fee Deduction from user and add to admin=================//
                            // =========================================================//
                            let futureProfit = 0;
                            try {
                                let profit = {
                                    source_id: oo?.id,
                                    total_usdt: 0,
                                    paid_usdt: 0,
                                    admin_usdt: 0,
                                    buyer: oo?.user_id,
                                    seller: oo?.user_id,
                                    profit: futureProfit,
                                    fees: releazedPnl,
                                    coin_type: 'USDT',
                                    source_type: 'Future Trading',
                                };
                                await marketProfit_model_1.default.create(profit);
                            }
                            catch (error) {
                                throw new Error(error.message);
                            }
                        }
                    }
                    // if (oo.side === 'open long') {
                    //     if (tt.price > oo.price_usdt || tt.price === oo.price_usdt) {
                    //         let create = await futurePositionModel.create(body);
                    //         if (create) {
                    //             await futureOpenOrderModel.update({ status: true, isDeleted: false }, { where: { id: oo.id } });
                    //         }
                    //     }
                    // }
                    // if (oo.side === 'open short') {
                    //     if (tt.price < oo.price_usdt || tt.price === oo.price_usdt) {
                    //         let create = await futurePositionModel.create(body);
                    //         if (create) {
                    //             await futureOpenOrderModel.update({ status: true, isDeleted: true }, { where: { id: oo.id } });
                    //         }
                    //     }
                    // }
                }
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async stopLimitOpenOrderCron() {
        try {
            let allTokens = await service_1.default.token.all();
            let openOrders = await future_open_order_model_1.default.findAll({ where: { status: false, isDeleted: false, isTrigger: false, type: { [sequelize_1.Op.or]: ['buy', 'sell'] } }, raw: true });
            if (openOrders) {
                for await (const oo of openOrders) {
                    let token = allTokens.filter((t) => {
                        return t?.dataValues?.id === oo?.coin_id;
                    });
                    let tt = token[0]?.dataValues;
                    if (Math.round(tt.price) === Math.round(parseFloat(oo.trigger))) {
                        await future_open_order_model_1.default.update({ isTrigger: true, type: 'limit' }, { where: { id: oo.id } });
                    }
                }
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async openOrderHistory(userId) {
        return await futureOpenOrder_dal_1.default.openOrderHistory(userId);
    }
}
exports.default = futureOpenOrderServices;

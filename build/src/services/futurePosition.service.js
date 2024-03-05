"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
const futurePosition_dal_1 = __importDefault(require("../models/dal/futurePosition.dal"));
const future_position_model_1 = __importDefault(require("../models/model/future_position.model"));
const service_1 = __importDefault(require("./service"));
class futurePositionServices {
    /**
     *
     * @returns return all published token
     */
    async all(userid) {
        return await futurePosition_dal_1.default.all(userid);
    }
    /**
     * Get position order by limit and offset for pagination
     * @param offset
     * @param limit
     * @returns
     */
    async allByLimit(offset, limit) {
        return await futurePosition_dal_1.default.allByLimit(offset, limit);
    }
    /**
     *
     * @param payload
     * @returns
     */
    async create(payload) {
        return await futurePosition_dal_1.default.createPosition(payload);
    }
    /**
     *
     * @param payload
     * @returns
     */
    async edit(payload) {
        return await futurePosition_dal_1.default.editPosition(payload);
    }
    /**
     * Cron position trading order and execute on price update
     * @returns
     */
    async positionCron() {
        try {
            let allTokens = await service_1.default.token.all();
            let positions = await future_position_model_1.default.findAll({ where: { status: false, queue: false }, raw: true });
            if (positions) {
                for await (let ps of positions) {
                    await future_position_model_1.default.update({ queue: true }, { where: { id: ps?.id } });
                    let token = allTokens.filter((t) => {
                        return t?.dataValues?.id === ps?.coin_id;
                    });
                    let tt = token[0]?.dataValues;
                    if (ps?.direction === 'long') {
                        //=====================================
                        //=========== Coin PnL ================
                        //=====================================
                        let coin_pnl = (((1 / ps?.entry_price) - (1 / tt?.price)) * ps?.size);
                        //=====================================
                        //=========== USDT PnL ================
                        //=====================================
                        let usdt_pnl = (coin_pnl * tt?.price);
                        // console.log(tt?.price,'========market price')
                        // console.log(ps?.entry_price,'===========ps entry_price');
                        // console.log(coin_pnl,'==========coin_pnl');                        
                        // console.log(usdt_pnl,'==========usdt_pnl');
                        // check if loss equal to position margin(user USDT assets) or less than margin than close position 
                        if (usdt_pnl < 0 && ps.order_type === 'value') {
                            let remainingMargin = ps.margin + usdt_pnl;
                            if (remainingMargin < 0 || remainingMargin === 0) {
                                await future_position_model_1.default.update({ status: true, isDeleted: true }, { where: { id: ps?.id } });
                                return;
                            }
                        }
                        else if (coin_pnl < 0 && ps.order_type === 'qty') {
                            let remainingMargin = ps.margin + coin_pnl;
                            if (remainingMargin < 0 || remainingMargin === 0) {
                                await future_position_model_1.default.update({ status: true, isDeleted: true }, { where: { id: ps?.id } });
                                return;
                            }
                        }
                        if (tt.price < ps.liq_price || tt.price === ps.liq_price) {
                            await future_position_model_1.default.update({ status: true, isDeleted: true }, { where: { id: ps?.id } });
                            return;
                        }
                        await future_position_model_1.default.update({ pnl: usdt_pnl, queue: false }, { where: { id: ps?.id } });
                    }
                    else if (ps?.direction === 'short') {
                        //=====================================
                        //=========== Coin PnL ================
                        //=====================================
                        let coin_pnl = (((1 / ps?.entry_price) - (1 / tt?.price)) * (ps?.size * -1));
                        //=====================================
                        //=========== USDT PnL ================
                        //=====================================
                        let usdt_pnl = (coin_pnl * tt?.price);
                        // check if loss equal to position margin(user USDT assets) or less than margin than close position 
                        if (usdt_pnl < 0 && ps.order_type === 'value') {
                            let remainingMargin = ps.margin + usdt_pnl;
                            if (remainingMargin < 0 || remainingMargin === 0) {
                                await future_position_model_1.default.update({ status: true, isDeleted: true }, { where: { id: ps?.id } });
                                return;
                            }
                        }
                        else if (coin_pnl < 0 && ps.order_type === 'qty') {
                            let remainingMargin = ps.margin + coin_pnl;
                            if (remainingMargin < 0 || remainingMargin === 0) {
                                await future_position_model_1.default.update({ status: true, isDeleted: true }, { where: { id: ps?.id } });
                                return;
                            }
                        }
                        if (tt.price > ps.liq_price || tt.price === ps.liq_price) {
                            await future_position_model_1.default.update({ status: true, isDeleted: true }, { where: { id: ps?.id } });
                            return;
                        }
                        await future_position_model_1.default.update({ pnl: usdt_pnl, queue: false }, { where: { id: ps?.id } });
                    }
                }
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    /**
     * Close position by user and position id
     * @param payload
     * @param userId
     * @returns
     */
    async closePositionById(payload, userId) {
        return await futurePosition_dal_1.default.closePosition(payload, userId);
    }
    /**
     * Close all position by user id
     * @param userId
     * @returns
     */
    async closeAllPositionByUser(userId) {
        return await futurePosition_dal_1.default.closeAllPosition(userId);
    }
    async positionHistory(userId) {
        return await futurePosition_dal_1.default.positionHistory(userId);
    }
    async coinLastData(coinid) {
        try {
            if (coinid === undefined)
                return;
            let data = await models_1.default.query(`SELECT DATE(current_date()) AS time, max(entry_price) AS high, min(entry_price) AS low,SUM(margin) as volume,
          CAST(SUBSTRING_INDEX(MIN(CONCAT(createdAt, '_', entry_price)), '_', -1) as double)  as open,
            CAST( SUBSTRING_INDEX(MAX(CONCAT(createdAt, '_', entry_price)), '_', -1)as double) AS close
          FROM exchanage.futurepositions AS marketorder where  coin_id='${coinid}' GROUP BY time`);
            if (data[0].length > 0) {
                return data[0][0];
            }
            else {
                return {
                    time: new Date(),
                    high: 0.00,
                    low: 0.00,
                    open: 0.00,
                    close: 0.00,
                    volume: 0.00
                };
            }
        }
        catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    // trades order book
    async orderbook(coinid) {
        return await futurePosition_dal_1.default.orderbook(coinid);
    }
}
exports.default = futurePositionServices;

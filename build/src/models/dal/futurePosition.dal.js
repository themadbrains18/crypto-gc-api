"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const future_position_model_1 = __importDefault(require("../model/future_position.model"));
const tokens_model_1 = __importDefault(require("../model/tokens.model"));
const global_token_model_1 = __importDefault(require("../model/global_token.model"));
const future_open_order_model_1 = __importDefault(require("../model/future_open_order.model"));
const assets_model_1 = __importDefault(require("../model/assets.model"));
const future_position_history_model_1 = __importDefault(require("../model/future_position_history.model"));
const marketProfit_model_1 = __importDefault(require("../model/marketProfit.model"));
const rewards_total_model_1 = __importDefault(require("../model/rewards_total.model"));
class futurePositionDal {
    /**
     * return all tokens data
     * @returns
     */
    async all(userid) {
        try {
            let trades = await future_position_model_1.default.findAll({
                where: { user_id: userid, isDeleted: false }, include: [
                    {
                        model: tokens_model_1.default
                    },
                    {
                        model: global_token_model_1.default
                    },
                    {
                        model: future_open_order_model_1.default
                    }
                ]
            });
            return trades;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async allByLimit(offset, limit) {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            let trades = await future_position_model_1.default.findAll({
                where: { isDeleted: false },
                limit: limits, offset: offsets, include: [
                    {
                        model: tokens_model_1.default
                    },
                    {
                        model: global_token_model_1.default
                    }
                ]
            });
            return trades;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * create new Position
     * @param payload
     * @returns
     */
    async createPosition(payload) {
        try {
            // ==================================================
            // ===============Get Active position================
            // ==================================================
            let activePosition = await future_position_model_1.default.findAll({ where: { user_id: payload.user_id, coin_id: payload?.coin_id, status: false, isDeleted: false }, raw: true });
            // Existing active position order
            if (activePosition.length > 0) {
                return await this.updateActivePosition(activePosition, payload);
            }
            // create new position
            else {
                return await this.createPositionFunction(payload);
            }
        }
        catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    //====================================================
    //===============Create New Position =================
    //====================================================
    async createPositionFunction(payload) {
        try {
            //================================================
            //=================== Get Token ==================
            //================================================
            let global_token = await global_token_model_1.default.findOne({ where: { symbol: 'USDT' }, raw: true });
            if (payload?.order_type !== 'value') {
                global_token = await global_token_model_1.default.findOne({ where: { id: payload?.coin_id }, raw: true });
                if (global_token === null) {
                    global_token = await tokens_model_1.default.findOne({ where: { id: payload?.coin_id }, raw: true });
                }
            }
            let asset;
            if (global_token) {
                asset = await assets_model_1.default.findOne({ where: { user_id: payload?.user_id, token_id: global_token?.id, walletTtype: 'future_wallet' }, raw: true });
            }
            // Get rewards point by userid
            let reward = await rewards_total_model_1.default.findOne({ where: { user_id: payload?.user_id }, raw: true });
            let margin_price = payload?.margin;
            let assets_price = 0;
            let reward_point = 0;
            // if assets and rewards point available than order margin divide in assets and rewards point
            if (asset?.balance > 0 && asset?.balance > margin_price) {
                if (reward && reward.amount > 0 && reward.amount > margin_price / 2) {
                    reward_point = margin_price / 2;
                    assets_price = margin_price / 2;
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
                    return { message: 'Insufficiant Balance' };
                }
            }
            payload.assets_margin = assets_price;
            let res = await future_position_model_1.default.create(payload);
            if (res) {
                // =========================================================================//
                // ================Fee Deduction from user and add to admin=================//
                // =========================================================================//
                let futureProfit = 0;
                try {
                    let profit = {
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
                    };
                    await marketProfit_model_1.default.create(profit);
                }
                catch (error) {
                    throw new Error(error.message);
                }
                //==========================================================
                //================ create position history =================
                //==========================================================
                let historyBody = {
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
                };
                await future_position_history_model_1.default.create(historyBody);
                //================================================
                //================ Update Assets =================
                //================================================
                if (assets_price > 0) {
                    let newbal = asset?.balance - (assets_price + payload.realized_pnl);
                    await assets_model_1.default.update({ balance: newbal }, { where: { user_id: payload?.user_id, token_id: global_token?.id, walletTtype: 'future_wallet' } });
                }
                if (reward_point > 0) {
                    let newRewardBal = reward?.amount - (reward_point);
                    await rewards_total_model_1.default.update({ amount: newRewardBal, order_amount: reward_point }, { where: { user_id: payload.user_id } });
                }
            }
            return res;
        }
        catch (error) {
        }
    }
    //=======================================================
    //===============Update active Position =================
    //=======================================================
    async updateActivePosition(activePosition, payload) {
        try {
            let newbal = 0;
            //================================================
            //=================== Get Token ==================
            //================================================
            let global_token = await global_token_model_1.default.findOne({ where: { symbol: 'USDT' }, raw: true });
            if (payload?.order_type !== 'value') {
                global_token = await global_token_model_1.default.findOne({ where: { id: payload?.coin_id }, raw: true });
                if (global_token === null) {
                    global_token = await tokens_model_1.default.findOne({ where: { id: payload?.coin_id }, raw: true });
                }
            }
            let asset;
            if (global_token) {
                asset = await assets_model_1.default.findOne({ where: { user_id: payload?.user_id, token_id: global_token?.id, walletTtype: 'future_wallet' }, raw: true });
            }
            // Get rewards point by userid
            let reward = await rewards_total_model_1.default.findOne({ where: { user_id: payload?.user_id }, raw: true });
            let margin_price = payload?.margin;
            let assets_price = 0;
            let reward_point = 0;
            // if assets and rewards point available than order margin divide in assets and rewards point
            if (asset?.balance > 0 && asset?.balance >= margin_price) {
                if (reward && reward.amount > 0 && reward.amount >= margin_price / 2) {
                    reward_point = margin_price / 2;
                    assets_price = margin_price / 2;
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
                    return { message: 'Insufficiant Balance' };
                }
            }
            if (activePosition.length > 1) {
                activePosition = activePosition.filter((item) => {
                    return item.position_mode === 'Hedge' && item.direction === payload.direction;
                });
            }
            activePosition = activePosition[0];
            // ================================================
            // ==================Hedge mode====================
            // ================================================
            if (activePosition?.position_mode === 'Hedge') {
                if (activePosition.direction === payload.direction) {
                    await future_position_model_1.default.update({
                        qty: activePosition.qty + payload.qty,
                        size: activePosition.size + payload.size,
                        realized_pnl: activePosition.realized_pnl + payload.realized_pnl,
                        entry_price: payload.entry_price,
                        market_price: payload.market_price,
                        margin: activePosition.margin + (payload.margin - payload.realized_pnl),
                        assets_margin: activePosition.assets_margin + assets_price
                    }, { where: { id: activePosition?.id, direction: payload.direction } });
                    newbal = asset?.balance - (assets_price + payload.realized_pnl);
                }
                else {
                    this.createPositionFunction(payload);
                }
            }
            // ================================================
            // ==================One way mode==================
            // ================================================
            else if (activePosition?.position_mode === 'oneWay') {
                // if order position same as previous order
                if (payload?.direction === activePosition.direction) {
                    activePosition.qty = activePosition.qty + payload.qty;
                    activePosition.realized_pnl = activePosition.realized_pnl + payload.realized_pnl;
                    activePosition.size = activePosition.size + payload?.size;
                    activePosition.margin = activePosition.margin + (payload.margin - payload.realized_pnl);
                    activePosition.assets_margin = activePosition.assets_margin + assets_price;
                    newbal = asset?.balance - (assets_price + payload.realized_pnl);
                }
                // if order position different from previous order
                else {
                    activePosition.qty = activePosition.qty - payload.qty;
                    activePosition.realized_pnl = activePosition.realized_pnl + payload.realized_pnl;
                    activePosition.size = activePosition.size - payload?.size;
                    activePosition.margin = activePosition.margin - (payload.margin - payload.realized_pnl);
                    activePosition.assets_margin = activePosition.assets_margin + assets_price;
                    newbal = asset?.balance + (assets_price - payload.realized_pnl);
                }
                // if quantity not 0 by new and previous order 
                if (activePosition.qty !== 0) {
                    await future_position_model_1.default.update({
                        qty: activePosition.qty, size: activePosition.size, realized_pnl: activePosition.realized_pnl,
                        entry_price: payload.entry_price, market_price: payload.market_price, margin: activePosition.margin, assets_margin: activePosition.assets_margin
                    }, { where: { id: activePosition?.id } });
                }
                // if qty 0 after opposite direction order
                else {
                    newbal = newbal + activePosition.pnl;
                    await future_position_model_1.default.update({ status: true, isDeleted: true }, { where: { id: activePosition?.id } });
                }
            }
            //================================================
            //================ Update Assets =================
            //================================================
            await assets_model_1.default.update({ balance: newbal }, { where: { user_id: payload?.user_id, token_id: global_token?.id, walletTtype: 'future_wallet' } });
            if (reward_point > 0) {
                let newRewardBal = reward?.amount - (reward_point);
                let newOrderAmount = reward?.order_amount + (reward_point);
                await rewards_total_model_1.default.update({ amount: newRewardBal, order_amount: newOrderAmount }, { where: { user_id: payload.user_id } });
            }
            // =========================================================================//
            // ===============================Fee Deduction=============================//
            // =========================================================================//
            let futureProfit = 0;
            try {
                let profit = {
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
                };
                await marketProfit_model_1.default.create(profit);
            }
            catch (error) {
                throw new Error(error.message);
            }
            //==========================================================
            //================ create position history =================
            //==========================================================
            let historyBody = {
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
            };
            await future_position_history_model_1.default.create(historyBody);
            activePosition = await future_position_model_1.default.findOne({ where: { user_id: payload.user_id, coin_id: payload?.coin_id, status: false, isDeleted: false }, raw: true });
            return activePosition;
        }
        catch (error) {
        }
    }
    /**
     * Edit Position
     * @param payload
     * @returns
     */
    async editPosition(payload) {
        try {
            return await future_position_model_1.default.update(payload, { where: { id: payload.id } });
        }
        catch (error) {
            console.log(error);
        }
    }
    /**
     * close Position
     */
    async closePosition(id, userId) {
        try {
            let position = await future_position_model_1.default.findOne({ where: { id: id }, raw: true });
            if (position) {
                let closeResponse = await future_position_model_1.default.update({ status: true, queue: true }, { where: { id: id } });
                let global_token = await global_token_model_1.default.findOne({ where: { symbol: 'USDT' }, raw: true });
                if (global_token) {
                    let asset = await assets_model_1.default.findOne({ where: { user_id: userId, token_id: global_token?.id, walletTtype: 'future_wallet' }, raw: true });
                    if (asset) {
                        let newBal = 0;
                        newBal = asset?.balance + position?.assets_margin + (position?.pnl - position?.realized_pnl);
                        // =========================================================//
                        // ================Fee Deduction from user and add to admin=================//
                        // =========================================================//
                        let futureProfit = 0;
                        if (position?.pnl < 0) {
                            futureProfit = position?.pnl * -1;
                        }
                        try {
                            let profit = {
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
                            };
                            await marketProfit_model_1.default.create(profit);
                        }
                        catch (error) {
                            throw new Error(error.message);
                        }
                        let updateAsset = await assets_model_1.default.update({ balance: newBal }, { where: { id: asset?.id } });
                        await future_position_model_1.default.update({ isDeleted: true }, { where: { id: id } });
                        await future_position_history_model_1.default.update({ status: true }, { where: { position_id: id } });
                        let historyBody = {
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
                        };
                        await future_position_history_model_1.default.create(historyBody);
                        return position;
                    }
                }
            }
            else {
                return { "data": null, "message": 'This position order record not found.' };
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async closeAllPosition(userId) {
        try {
            let data = [];
            let allPosition = await future_position_model_1.default.findAll({ where: { user_id: userId, status: false, queue: false }, raw: true });
            for await (let ps of allPosition) {
                let response = await this.closePosition(ps?.id, userId);
                data.push(response);
            }
            if (data.length === allPosition.length) {
                return allPosition;
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * Get user position history
     * @param userid
     * @returns
     */
    async positionHistory(userid) {
        try {
            let trades = await future_position_history_model_1.default.findAll({
                where: { user_id: userid }
            });
            return trades;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async orderbook(coinid) {
        try {
            let trades = await future_position_model_1.default.findAll({
                where: { coin_id: coinid, status: false, isDeleted: false }, raw: true
            });
            return trades;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = new futurePositionDal();

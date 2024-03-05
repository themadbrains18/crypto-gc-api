"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const future_open_order_model_1 = __importDefault(require("../model/future_open_order.model"));
const global_token_model_1 = __importDefault(require("../model/global_token.model"));
const tokens_model_1 = __importDefault(require("../model/tokens.model"));
const assets_model_1 = __importDefault(require("../model/assets.model"));
const main_controller_1 = __importDefault(require("../../controllers/main.controller"));
class futureOpenOrderDal extends main_controller_1.default {
    /**
     * return all tokens data
     * @returns
     */
    async all(userid) {
        try {
            let trades = await future_open_order_model_1.default.findAll({ where: { user_id: userid, status: false, isDeleted: false } });
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
            let trades = await future_open_order_model_1.default.findAll({ where: { isDeleted: false }, limit: limits, offset: offsets });
            return trades;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * create new token
     * @param payload
     * @returns
     */
    async createOpenOrder(payload) {
        try {
            //================================================
            //=================== Get Token =================
            //================================================
            let global_token = await global_token_model_1.default.findOne({ where: { symbol: 'USDT' }, raw: true });
            if (payload?.order_type !== 'value') {
                global_token = await global_token_model_1.default.findOne({ where: { id: payload?.coin_id }, raw: true });
                if (global_token === null) {
                    global_token = await tokens_model_1.default.findOne({ where: { id: payload?.coin_id }, raw: true });
                }
            }
            if (global_token) {
                let asset = await assets_model_1.default.findOne({ where: { user_id: payload?.user_id, token_id: global_token?.id, walletTtype: 'future_wallet' }, raw: true });
                let margin_price = payload?.margin;
                if (asset?.balance > 0 && (asset.balance > margin_price)) {
                    //================================================
                    //===============Create Position =================
                    //================================================
                    let res = await future_open_order_model_1.default.create(payload);
                    if (res) {
                        //================================================
                        //================ Update Assets =================
                        //================================================
                        let newbal = asset?.balance - margin_price;
                        await assets_model_1.default.update({ balance: newbal }, { where: { user_id: payload?.user_id, token_id: global_token?.id, walletTtype: 'future_wallet' } });
                    }
                    return res;
                }
                else {
                    // super.fail(express.response,'Insufficiant Balance')
                    // // throw new Error('Insufficiant Balance');
                    return { "error": "Insufficiant Balance" };
                }
            }
        }
        catch (error) {
            console.log(error);
            throw new Error(error?.message);
        }
    }
    async editOpenOrder(payload) {
        try {
            return await future_open_order_model_1.default.update(payload, { where: { id: payload.id } });
        }
        catch (error) {
            console.log(error);
        }
    }
    async closeOpenOrderById(payload, userId) {
        try {
            let order = await future_open_order_model_1.default.findOne({ where: { id: payload, isDeleted: false }, raw: true });
            if (order) {
                let global_token = await global_token_model_1.default.findOne({ where: { symbol: 'USDT' }, raw: true });
                if (global_token) {
                    let asset = await assets_model_1.default.findOne({ where: { user_id: userId, token_id: global_token?.id, walletTtype: 'future_wallet' }, raw: true });
                    if (asset) {
                        let newBal = asset?.balance + order?.margin;
                        let updateAsset = await assets_model_1.default.update({ balance: newBal }, { where: { id: asset?.id } });
                        await future_open_order_model_1.default.update({ isDeleted: true }, { where: { id: payload } });
                        // order.isDeleted = true;
                        return order;
                    }
                }
            }
            else {
                return { "data": null, "message": 'This order record not found.' };
            }
        }
        catch (error) {
            console.log(error, '=========here');
            return { error: error.message };
        }
    }
    /**
     * Get user open order history
     * @param userid
     * @returns
     */
    async openOrderHistory(userid) {
        try {
            let trades = await future_open_order_model_1.default.findAll({
                where: { user_id: userid },
            });
            return trades;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = new futureOpenOrderDal();

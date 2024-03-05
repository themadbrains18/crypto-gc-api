"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const futuretrade_model_1 = __importDefault(require("../model/futuretrade.model"));
const tokens_model_1 = __importDefault(require("../model/tokens.model"));
const global_token_model_1 = __importDefault(require("../model/global_token.model"));
const service_1 = __importDefault(require("../../services/service"));
class futureTradePairDal {
    /**
     * return all tokens data
     * @returns
     */
    async all() {
        try {
            let trades = await futuretrade_model_1.default.findAll({
                where: { status: true }, include: [
                    {
                        model: tokens_model_1.default
                    },
                    {
                        model: global_token_model_1.default
                    }
                ],
            });
            let newCoin = [];
            for await (const coin of trades) {
                let token = coin?.dataValues;
                if (coin.dataValues?.coin_id !== undefined) {
                    let hloc = await service_1.default.position.coinLastData(coin.dataValues?.coin_id);
                    token.hloc = hloc;
                    newCoin.push(token);
                }
            }
            return newCoin;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async allByLimit(offset, limit) {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            let trades = await futuretrade_model_1.default.findAll({
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
     *
     * @param payload if contract already register
     * @returns
     */
    async pairIfExist(payload) {
        try {
            let trades = await futuretrade_model_1.default.findOne({ where: { id: payload?.id }, raw: true });
            if (trades) {
                return trades;
            }
        }
        catch (error) {
            throw new Error(error?.message);
        }
    }
    /**
     * create new token
     * @param payload
     * @returns
     */
    async createPair(payload) {
        try {
            return await futuretrade_model_1.default.create(payload);
        }
        catch (error) {
            console.log(error);
        }
    }
    async editPair(payload) {
        try {
            return await futuretrade_model_1.default.update(payload, { where: { id: payload.id } });
        }
        catch (error) {
            console.log(error);
        }
    }
    async changeStatus(payload) {
        try {
            let pair = await futuretrade_model_1.default.findOne({ where: { id: payload?.id } });
            let apiStatus;
            apiStatus = await pair.update({ status: pair?.dataValues?.status == true ? false : true });
            return apiStatus;
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
exports.default = new futureTradePairDal();

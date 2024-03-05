"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tradePair_model_1 = __importDefault(require("../model/tradePair.model"));
class tradePairDal {
    /**
     * return all tokens data
     * @returns
     */
    async all() {
        try {
            let trades = await tradePair_model_1.default.findAll({ raw: true });
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
            let trades = await tradePair_model_1.default.findAll({ limit: limits, offset: offsets });
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
            let trades = await tradePair_model_1.default.findOne({ where: { id: payload?.id }, raw: true });
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
            return await tradePair_model_1.default.create(payload);
        }
        catch (error) {
            console.log(error);
        }
    }
    async editPair(payload) {
        try {
            return await tradePair_model_1.default.update(payload, { where: { id: payload.id } });
        }
        catch (error) {
            console.log(error);
        }
    }
    async changeStatus(payload) {
        try {
            let pair = await tradePair_model_1.default.findOne({ where: { id: payload?.id } });
            let apiStatus;
            apiStatus = await pair.update({ status: pair?.dataValues?.status == true ? false : true });
            return apiStatus;
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
exports.default = new tradePairDal();

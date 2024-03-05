"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sitemaintenace_model_1 = __importDefault(require("../model/sitemaintenace.model"));
class siteMaintenanceDal {
    /**
     * return all tokens data
     * @returns
     */
    async all() {
        try {
            let trades = await sitemaintenace_model_1.default.findAll({ raw: true });
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
    async createSiteMaintenance(payload) {
        try {
            return await sitemaintenace_model_1.default.create(payload);
        }
        catch (error) {
            console.log(error);
        }
    }
    async editSiteMaintenance(payload) {
        try {
            return await sitemaintenace_model_1.default.update(payload, { where: { id: payload.id } });
        }
        catch (error) {
            console.log(error);
        }
    }
    async changeStatus(payload) {
        try {
            let pair = await sitemaintenace_model_1.default.findOne({ where: { id: payload?.id }, raw: true });
            let apiStatus;
            apiStatus = await sitemaintenace_model_1.default.update({ down_status: pair?.down_status == true ? false : true }, { where: { id: payload?.id } });
            return apiStatus;
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
exports.default = new siteMaintenanceDal();

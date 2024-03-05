"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
class convertController extends main_controller_1.default {
    async executeImpl(req, res) {
        try {
            // ... Handle request by creating objects
        }
        catch (error) {
            return this.fail(res, error.toString());
        }
    }
    /**
     *
     * @param res
     * @param req
     */
    async saveConvert(req, res, next) {
        try {
            let bodyData = req.body?.convert;
            bodyData.user_id = req.body?.user_id;
            let bodyHistoryData = req.body?.history;
            // create convert record and update asset of user and admin
            let response = await service_1.default.convert.create(bodyData);
            // on convert successfully create history data
            if (response.status === undefined) {
                for await (const body of bodyHistoryData) {
                    let data = body;
                    data.user_id = req.body?.user_id;
                    data.convert_id = response?.dataValues?.id;
                    await service_1.default.convert.createhistory(data);
                }
            }
            else {
                return super.fail(res, response.message);
            }
            return super.ok(res, response);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async getConvertList(req, res, next) {
        try {
            let responseData = await service_1.default.convert.getConvertRecord(req.body.user_id);
            return super.ok(res, responseData);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async getConvertHistoryList(req, res, next) {
        try {
            let responseData = await service_1.default.convert.getConvertHistory(req.body.user_id);
            return super.ok(res, responseData);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
}
exports.default = convertController;

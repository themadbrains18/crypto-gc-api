"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const convert_dal_1 = __importDefault(require("../models/dal/convert.dal"));
class convertService {
    /**
     *
     * @param payload
     * @returns
     */
    async create(payload) {
        return await convert_dal_1.default.createConvert(payload);
    }
    async createhistory(payload) {
        return await convert_dal_1.default.createConvertHistory(payload);
    }
    async getConvertRecord(user_id) {
        return await convert_dal_1.default.getRecord(user_id);
    }
    async getConvertHistory(user_id) {
        return await convert_dal_1.default.getHistoryRecord(user_id);
    }
}
exports.default = convertService;

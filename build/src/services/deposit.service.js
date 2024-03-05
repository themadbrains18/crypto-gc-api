"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deposit_dal_1 = __importDefault(require("../models/dal/deposit.dal"));
class depositServices {
    /**
     *
     * @param payload
     * @returns
     */
    async getDepositListById(user_id) {
        return deposit_dal_1.default.getListOfDepositById(user_id);
    }
    async getDepositList() {
        return deposit_dal_1.default.getListOfDeposit();
    }
    async getDepositListByLimit(offset, limit) {
        return deposit_dal_1.default.getDepositListByLimit(offset, limit);
    }
    async getDepositHistoryById(user_id) {
        return deposit_dal_1.default.getHistoryOfDepositById(user_id);
    }
    async getDepositHistoryByIdAndLimit(user_id, offset, limit) {
        return deposit_dal_1.default.getHistoryOfDepositByIdLimit(user_id, offset, limit);
    }
}
exports.default = depositServices;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p_method_dal_1 = __importDefault(require("../models/dal/p_method.dal"));
const user_p_method_dal_1 = __importDefault(require("../models/dal/user_p_method.dal"));
class paymentMethodService {
    /**
     * Add new payment method from admin dashboard
     * @param payload
     * @returns
     */
    async create(payload) {
        return await p_method_dal_1.default.create(payload);
    }
    async getMethodList() {
        return await p_method_dal_1.default.getPaymentList();
    }
    async getPaymentMethodById(payload) {
        return await p_method_dal_1.default.getPaymentListById(payload);
    }
    async createUserPaymentMethod(payload) {
        return await user_p_method_dal_1.default.create(payload);
    }
    async getUserMethod(payload) {
        return await user_p_method_dal_1.default.getUserMethod(payload);
    }
    async removeUserMethodById(payload) {
        return await user_p_method_dal_1.default.removeUserMethodById(payload);
    }
}
exports.default = paymentMethodService;

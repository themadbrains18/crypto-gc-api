"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p_method_model_1 = __importDefault(require("../model/p_method.model"));
class paymentMethodDal {
    /**
     * Add new payment method from admin dashboard
     * @param payload
     * @returns
     */
    async create(payload) {
        let p_method = p_method_model_1.default.findAll({ where: { payment_method: payload.payment_method } });
        if ((await p_method).length > 0) {
            return { status: 500, message: "This Method is already exist!!." };
        }
        return await p_method_model_1.default.create(payload);
    }
    async getPaymentList() {
        return await p_method_model_1.default.findAll();
    }
    async getPaymentListById(payload) {
        return await p_method_model_1.default.findOne({ where: { id: payload } });
    }
}
exports.default = new paymentMethodDal();

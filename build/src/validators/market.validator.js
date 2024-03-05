"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const marketSchema = {
    create: joi_1.default.object().keys({
        user_id: joi_1.default.string().required(),
        token_id: joi_1.default.string().required(),
        market_type: joi_1.default.string().required(),
        order_type: joi_1.default.string().required(),
        limit_usdt: joi_1.default.number().positive().required(),
        volume_usdt: joi_1.default.number().positive().required(),
        token_amount: joi_1.default.number().positive().required(),
        status: joi_1.default.boolean().required(),
        isCanceled: joi_1.default.boolean().required(),
        queue: joi_1.default.boolean().required(),
        fee: joi_1.default.number().required(),
        is_fee: joi_1.default.boolean().required()
    }),
    cancel: joi_1.default.object().keys({
        user_id: joi_1.default.string().required(),
        order_id: joi_1.default.string().required()
    })
};
exports.default = marketSchema;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//* validators/token.validator.js
// schemas.js
const joi_1 = __importDefault(require("joi"));
const futureOpenOrderSchema = {
    // trigger when list new a exchange
    create: joi_1.default.object().keys({
        position_id: joi_1.default.string().optional(),
        symbol: joi_1.default.string().required(),
        user_id: joi_1.default.string().required(),
        side: joi_1.default.string().required(),
        type: joi_1.default.string().required(),
        time: joi_1.default.date().optional(),
        amount: joi_1.default.string().required(),
        price_usdt: joi_1.default.number().required(),
        trigger: joi_1.default.string().required(),
        reduce_only: joi_1.default.string().required(),
        post_only: joi_1.default.string().required(),
        status: joi_1.default.boolean().default("false"),
        leverage: joi_1.default.number().optional(),
        market_price: joi_1.default.number().positive().required(),
        margin: joi_1.default.number().optional(),
        liq_price: joi_1.default.number().optional(),
        order_type: joi_1.default.string().optional(),
        leverage_type: joi_1.default.string().optional(),
        coin_id: joi_1.default.string().required(),
        isDeleted: joi_1.default.boolean().default("false"),
        qty: joi_1.default.number().required(),
        isTrigger: joi_1.default.boolean().default("false"),
    }),
    edit: joi_1.default.object().keys({
        id: joi_1.default.string().required(),
        position_id: joi_1.default.string().optional(),
        symbol: joi_1.default.string().required(),
        user_id: joi_1.default.string().required(),
        side: joi_1.default.string().required(),
        type: joi_1.default.string().required(),
        time: joi_1.default.date().required(),
        amount: joi_1.default.string().required(),
        price_usdt: joi_1.default.number().required(),
        trigger: joi_1.default.string().required(),
        reduce_only: joi_1.default.string().required(),
        post_only: joi_1.default.string().required(),
        status: joi_1.default.boolean().default("false"),
        leverage: joi_1.default.number().optional(),
        market_price: joi_1.default.number().positive().required(),
        margin: joi_1.default.number().optional(),
        liq_price: joi_1.default.number().optional(),
        order_type: joi_1.default.string().optional(),
        leverage_type: joi_1.default.string().optional(),
        coin_id: joi_1.default.string().required(),
        isDeleted: joi_1.default.boolean().default("false"),
        qty: joi_1.default.number().required(),
        isTrigger: joi_1.default.boolean().default("false"),
    }),
};
exports.default = futureOpenOrderSchema;

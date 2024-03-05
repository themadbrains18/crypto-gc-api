"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//* validators/token.validator.js
// schemas.js
const joi_1 = __importDefault(require("joi"));
const futurePositionSchema = {
    // trigger when list new a exchange
    create: joi_1.default.object().keys({
        symbol: joi_1.default.string().required(),
        user_id: joi_1.default.string().required(),
        coin_id: joi_1.default.string().required(),
        leverage: joi_1.default.number().optional(),
        size: joi_1.default.number().optional(),
        entry_price: joi_1.default.number().positive().required(),
        market_price: joi_1.default.number().positive().required(),
        liq_price: joi_1.default.number().optional(),
        margin: joi_1.default.number().positive().required(),
        margin_ratio: joi_1.default.number().positive().required(),
        pnl: joi_1.default.number().optional(),
        realized_pnl: joi_1.default.number().optional(),
        tp_sl: joi_1.default.string().optional(),
        status: joi_1.default.boolean().default("false"),
        queue: joi_1.default.boolean().default("false"),
        direction: joi_1.default.string().required(),
        order_type: joi_1.default.string().required(),
        leverage_type: joi_1.default.string().required(),
        market_type: joi_1.default.string().required(),
        qty: joi_1.default.number().required(),
        position_mode: joi_1.default.string().required()
    }),
    edit: joi_1.default.object().keys({
        id: joi_1.default.string().required(),
        symbol: joi_1.default.string().required(),
        user_id: joi_1.default.string().required(),
        coin_id: joi_1.default.string().required(),
        leverage: joi_1.default.number().optional(),
        size: joi_1.default.number().optional(),
        entry_price: joi_1.default.number().positive().required(),
        market_price: joi_1.default.number().positive().required(),
        liq_price: joi_1.default.number().optional(),
        margin: joi_1.default.number().positive().required(),
        margin_ratio: joi_1.default.number().positive().required(),
        pnl: joi_1.default.number().optional(),
        realized_pnl: joi_1.default.number().optional(),
        tp_sl: joi_1.default.string().optional(),
        status: joi_1.default.boolean().default("false"),
        queue: joi_1.default.boolean().default("false"),
        direction: joi_1.default.string().required(),
        order_type: joi_1.default.string().required(),
        leverage_type: joi_1.default.string().required(),
        market_type: joi_1.default.string().required(),
        qty: joi_1.default.number().required()
    }),
};
exports.default = futurePositionSchema;

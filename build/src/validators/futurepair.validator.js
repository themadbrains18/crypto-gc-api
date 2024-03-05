"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//* validators/token.validator.js
// schemas.js
const joi_1 = __importDefault(require("joi"));
const futuretradePairSchema = {
    // trigger when list new a exchange
    create: joi_1.default.object().keys({
        coin_id: joi_1.default.string().required(),
        usdt_id: joi_1.default.string().required(),
        coin_symbol: joi_1.default.string().required(),
        usdt_symbol: joi_1.default.string().required(),
        coin_fee: joi_1.default.number().optional(),
        usdt_fee: joi_1.default.number().optional(),
        coin_min_trade: joi_1.default.number().positive().required(),
        usdt_min_trade: joi_1.default.number().positive().required(),
        status: joi_1.default.boolean().default("false"),
    }),
    edit: joi_1.default.object().keys({
        id: joi_1.default.string().required(),
        coin_id: joi_1.default.string().required(),
        usdt_id: joi_1.default.string().required(),
        coin_symbol: joi_1.default.string().required(),
        usdt_symbol: joi_1.default.string().required(),
        coin_fee: joi_1.default.number().optional(),
        usdt_fee: joi_1.default.number().optional(),
        coin_min_trade: joi_1.default.number().positive().required(),
        usdt_min_trade: joi_1.default.number().positive().required(),
        status: joi_1.default.boolean().default("false"),
    }),
};
exports.default = futuretradePairSchema;

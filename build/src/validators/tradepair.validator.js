"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//* validators/token.validator.js
// schemas.js
const joi_1 = __importDefault(require("joi"));
const tradePairSchema = {
    // trigger when list new a exchange
    create: joi_1.default.object().keys({
        user_id: joi_1.default.string().required(),
        tokenOne: joi_1.default.string().required(),
        tokenTwo: joi_1.default.string().required(),
        symbolOne: joi_1.default.string().required(),
        symbolTwo: joi_1.default.string().required(),
        maker: joi_1.default.number().optional(),
        taker: joi_1.default.number().optional(),
        min_trade: joi_1.default.number().positive().required(),
        status: joi_1.default.boolean().default("false"),
    }),
    edit: joi_1.default.object().keys({
        user_id: joi_1.default.string().required(),
        id: joi_1.default.string().required(),
        tokenOne: joi_1.default.string().required(),
        tokenTwo: joi_1.default.string().required(),
        symbolOne: joi_1.default.string().required(),
        symbolTwo: joi_1.default.string().required(),
        maker: joi_1.default.number().optional(),
        taker: joi_1.default.number().optional(),
        min_trade: joi_1.default.number().positive().required(),
        status: joi_1.default.boolean().default("false"),
    }),
};
exports.default = tradePairSchema;

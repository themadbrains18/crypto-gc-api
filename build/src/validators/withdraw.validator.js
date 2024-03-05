"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//* validators/withdraw.validator.js
// schemas.js
const joi_1 = __importDefault(require("joi"));
const withdrawSchema = {
    // trigger when list new a exchange
    create: joi_1.default.object().keys({
        symbol: joi_1.default.string().uppercase().min(3).max(5).required(),
        tokenName: joi_1.default.string().required(),
        tokenID: joi_1.default.string().required(),
        withdraw_wallet: joi_1.default.string().required(),
        amount: joi_1.default.number().positive().required(),
        status: joi_1.default.string().required(),
        user_id: joi_1.default.string().required(),
        tx_hash: joi_1.default.string().optional(),
        tx_type: joi_1.default.string().optional(),
        fee: joi_1.default.string().required(),
        networkId: joi_1.default.string().required(),
        type: joi_1.default.string().required(),
        username: joi_1.default.string().required(),
        otp: joi_1.default.string().required(),
        step: joi_1.default.number().required(),
    }),
};
exports.default = withdrawSchema;

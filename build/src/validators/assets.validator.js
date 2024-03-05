"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const assetSchema = {
    create: joi_1.default.object().keys({
        user_id: joi_1.default.string().required(),
        account_type: joi_1.default.string().required(),
        walletTtype: joi_1.default.string().required(),
        token_id: joi_1.default.string().required(),
        balance: joi_1.default.number().required(),
    }),
    walletTowallet: joi_1.default.object().keys({
        user_id: joi_1.default.string().required(),
        from: joi_1.default.string().required(),
        to: joi_1.default.string().required(),
        token_id: joi_1.default.string().required(),
        balance: joi_1.default.number().positive().required(),
    }),
};
exports.default = assetSchema;

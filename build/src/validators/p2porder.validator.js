"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const p2pOrderSchema = {
    create: joi_1.default.object().keys({
        post_id: joi_1.default.string().required(),
        sell_user_id: joi_1.default.string().required(),
        buy_user_id: joi_1.default.string().required(),
        token_id: joi_1.default.string().required(),
        price: joi_1.default.number().positive().required(),
        quantity: joi_1.default.number().positive().required(),
        spend_amount: joi_1.default.number().positive().required(),
        receive_amount: joi_1.default.number().positive().required(),
        spend_currency: joi_1.default.string().required(),
        receive_currency: joi_1.default.string().required(),
        p_method: joi_1.default.string().optional().allow(''),
        status: joi_1.default.string().required(),
        type: joi_1.default.string().required()
    }),
    cancel: joi_1.default.object().keys({
        order_id: joi_1.default.string().required(),
        user_id: joi_1.default.string().required()
    }),
    update: joi_1.default.object().keys({
        order_id: joi_1.default.string().required(),
    }),
    release: joi_1.default.object().keys({
        order_id: joi_1.default.string().required(),
        user_id: joi_1.default.string().required(),
        fundcode: joi_1.default.number().positive().required()
    })
};
exports.default = p2pOrderSchema;

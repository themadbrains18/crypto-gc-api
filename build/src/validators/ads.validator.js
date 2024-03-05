"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const adsPostSchema = {
    create: joi_1.default.object().keys({
        user_id: joi_1.default.string().required(),
        token_id: joi_1.default.string().required(),
        price: joi_1.default.number().positive().positive().required(),
        quantity: joi_1.default.number().positive().positive().required(),
        min_limit: joi_1.default.number().positive().positive().required(),
        max_limit: joi_1.default.number().positive().positive().required(),
        p_method: joi_1.default.array().items({ "upm_id": joi_1.default.string().required() }).required(),
        payment_time: joi_1.default.string().required(),
        notes: joi_1.default.string().optional().allow(''),
        checked: joi_1.default.boolean().optional().allow(''),
        status: joi_1.default.boolean().optional().allow(''),
        fundcode: joi_1.default.string().optional().allow(''),
        condition: joi_1.default.string().optional().allow(''),
        auto_reply: joi_1.default.string().optional().allow('')
    }),
    edit: joi_1.default.object().keys({
        id: joi_1.default.string().required(),
        user_id: joi_1.default.string().required(),
        token_id: joi_1.default.string().required(),
        price: joi_1.default.number().positive().positive().required(),
        quantity: joi_1.default.number().positive().positive().required(),
        min_limit: joi_1.default.number().positive().positive().required(),
        max_limit: joi_1.default.number().positive().positive().required(),
        p_method: joi_1.default.array().items({ "upm_id": joi_1.default.string().required() }).required(),
        payment_time: joi_1.default.string().required(),
        notes: joi_1.default.string().optional().allow(''),
        checked: joi_1.default.boolean().optional().allow(''),
        status: joi_1.default.boolean().optional().allow(''),
        fundcode: joi_1.default.string().optional().allow(''),
        condition: joi_1.default.string().optional().allow(''),
        auto_reply: joi_1.default.string().optional().allow('')
    }),
    status: joi_1.default.object().keys({
        post_id: joi_1.default.string().required(),
        user_id: joi_1.default.string().required()
    })
};
exports.default = adsPostSchema;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const stakingSchema = {
    create: joi_1.default.object().keys({
        user_id: joi_1.default.string().required(),
        token_id: joi_1.default.string().required(),
        amount: joi_1.default.number().positive().required(),
        apr: joi_1.default.number().required(),
        time_log: joi_1.default.number().positive().required(),
        time_format: joi_1.default.string().required(),
        status: joi_1.default.boolean().optional(),
        queue: joi_1.default.boolean().optional(),
        redeem: joi_1.default.boolean().optional()
    }),
    release: joi_1.default.object().keys({
        id: joi_1.default.string().required(),
        step: joi_1.default.number().required(),
        username: joi_1.default.string().required(),
        otp: joi_1.default.string().required()
    }),
    adminstake: joi_1.default.object().keys({
        token_id: joi_1.default.string().required(),
        minimum_amount: joi_1.default.number().positive().required(),
        apr: joi_1.default.number().required(),
        lockTime: joi_1.default.array().items(joi_1.default.object({
            "duration": joi_1.default.number().positive().required(),
            "time": joi_1.default.string().required()
        })).required(),
        status: joi_1.default.boolean().optional().default(true),
    }),
};
exports.default = stakingSchema;

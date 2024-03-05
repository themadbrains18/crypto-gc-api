"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const chatSchema = {
    create: joi_1.default.object().keys({
        post_id: joi_1.default.string().required(),
        sell_user_id: joi_1.default.string().required(),
        buy_user_id: joi_1.default.string().required(),
        from: joi_1.default.string().required(),
        to: joi_1.default.string().required(),
        orderid: joi_1.default.string().required(),
        chat: joi_1.default.string().required()
    })
};
exports.default = chatSchema;

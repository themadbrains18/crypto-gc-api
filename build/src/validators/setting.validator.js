"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const settingSchema = {
    updatefundcode: joi_1.default.object().keys({
        user_id: joi_1.default.string().required(),
        old_password: joi_1.default.optional(),
        new_password: joi_1.default.string().required()
    }),
    updatepassword: joi_1.default.object().keys({
        user_id: joi_1.default.string().required(),
        old_password: joi_1.default.string().required(),
        new_password: joi_1.default.string().required()
    }),
};
exports.default = settingSchema;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//* validators/register.validator.js
const joi_1 = __importDefault(require("joi"));
const registerSchema = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().required(),
    username: joi_1.default.string().min(1).required(),
    password: joi_1.default.string().min(4).required(),
    name: joi_1.default.string().min(1).required(),
    surname: joi_1.default.string().min(1).required()
});
exports.default = registerSchema;

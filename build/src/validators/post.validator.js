"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//* validators/post.validator.js
const joi_1 = __importDefault(require("joi"));
const postSchema = joi_1.default.object({
    title: joi_1.default.string().min(5).required(),
    content: joi_1.default.string().min(1).required(),
    tags: joi_1.default.array().items(joi_1.default.string()).min(2).max(4).required()
});
exports.default = postSchema;

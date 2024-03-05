"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const profileSchema = {
    create: joi_1.default.object().keys({
        fName: joi_1.default.string().required(),
        lName: joi_1.default.string().required(),
        dName: joi_1.default.string().required(),
        uName: joi_1.default.string().required(),
        user_id: joi_1.default.string().required()
    }),
};
exports.default = profileSchema;

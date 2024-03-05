"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//* validators/token.validator.js
// schemas.js
const joi_1 = __importDefault(require("joi"));
const siteMaintenanceSchema = {
    // trigger when list new a exchange
    create: joi_1.default.object().keys({
        user_id: joi_1.default.string().required(),
        title: joi_1.default.string().required(),
        message: joi_1.default.string().required(),
    }),
    edit: joi_1.default.object().keys({
        user_id: joi_1.default.string().required(),
        id: joi_1.default.string().required(),
        title: joi_1.default.string().required(),
        message: joi_1.default.string().required(),
    }),
};
exports.default = siteMaintenanceSchema;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const p_methodSchema = {
    create: joi_1.default.object().keys({
        payment_method: joi_1.default.string().required(),
        icon: joi_1.default.binary().encoding('utf8').optional(),
        region: joi_1.default.string().required(),
        fields: joi_1.default.array().items({
            "name": joi_1.default.string().required(),
            "type": joi_1.default.string().required(),
            "label": joi_1.default.string().optional(),
            "required": joi_1.default.string().optional(),
            "ifoptional": joi_1.default.string().optional(),
            "placeholder": joi_1.default.string().optional(),
            "err_msg": joi_1.default.string().optional(),
        }).required()
    })
};
exports.default = p_methodSchema;

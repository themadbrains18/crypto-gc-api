"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//* validators/token.validator.js
// schemas.js
const joi_1 = __importDefault(require("joi"));
const tokenSchema = {
    // trigger when list new a exchange
    create: joi_1.default.object().keys({
        symbol: joi_1.default.string().uppercase().min(3).max(5).required(),
        fullName: joi_1.default.string().regex(/^[a-zA-Z0-9, ]*$/, 'Alphanumerics, space and comma characters').min(3).max(30).required(),
        minimum_withdraw: joi_1.default.number().required(),
        decimals: joi_1.default.number().positive().greater(5).less(20).required(),
        tokenType: joi_1.default.string().required(),
        image: joi_1.default.string().optional(),
        status: joi_1.default.boolean().default("false"),
        networks: joi_1.default.array().items(joi_1.default.object({
            "id": joi_1.default.string().required(),
            // "abi": Joi.object().optional(),
            "fee": joi_1.default.number().positive().greater(0.001).required(),
            "decimal": joi_1.default.number().positive().greater(5).less(20).optional(),
            "contract": joi_1.default.string().required(),
        })).required(),
        price: joi_1.default.number().positive().greater(0).required(),
        min_price: joi_1.default.number().positive().greater(0).required(),
        max_price: joi_1.default.number().positive().greater(0).required(),
        type: joi_1.default.string().required(),
        fees: joi_1.default.number().optional()
    }),
    edit: joi_1.default.object().keys({
        id: joi_1.default.string().required(),
        symbol: joi_1.default.string().uppercase().min(3).max(5).required(),
        fullName: joi_1.default.string().regex(/^[a-zA-Z0-9, ]*$/, 'Alphanumerics, space and comma characters').min(3).max(30).required(),
        minimum_withdraw: joi_1.default.number().required(),
        decimals: joi_1.default.number().positive().greater(5).less(20).required(),
        tokenType: joi_1.default.string().required(),
        image: joi_1.default.string().allow(''),
        status: joi_1.default.boolean().default("false"),
        networks: joi_1.default.array().items(joi_1.default.object({
            "id": joi_1.default.string().required(),
            // "abi": Joi.object().optional(),
            "fee": joi_1.default.number().positive().greater(0.001).required(),
            "decimal": joi_1.default.number().positive().greater(5).less(20).optional(),
            "contract": joi_1.default.string().required(),
        })).required(),
        price: joi_1.default.number().positive().greater(0).required(),
        min_price: joi_1.default.number().positive().greater(0).required(),
        max_price: joi_1.default.number().positive().greater(0).required(),
        type: joi_1.default.string().required(),
    }),
    // get specfic token token
    blogLIST: {
        page: joi_1.default.number().required(),
        pageSize: joi_1.default.number().required(),
    },
};
exports.default = tokenSchema;

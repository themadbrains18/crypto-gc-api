"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const tokenListingSchema = {
    create: joi_1.default.object().keys({
        user_id: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        symbol: joi_1.default.string().required(),
        logo: joi_1.default.binary().encoding('utf8').optional(),
        issue_price: joi_1.default.number().positive().required(),
        issue_date: joi_1.default.required(),
        decimals: joi_1.default.number().integer().positive().required(),
        fees: joi_1.default.number().positive().required(),
        max_supply: joi_1.default.number().positive().optional(),
        circulating_supply: joi_1.default.number().positive().optional(),
        explore_link: joi_1.default.optional(),
        white_pp_link: joi_1.default.optional(),
        website_link: joi_1.default.optional(),
        introduction: joi_1.default.optional(),
        network: joi_1.default.array().items({ "contract": joi_1.default.string().required() }).optional(),
        status: joi_1.default.boolean().required()
    })
};
exports.default = tokenListingSchema;

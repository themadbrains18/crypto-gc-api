"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//* validators/token.validator.js
// schemas.js
const joi_1 = __importDefault(require("joi"));
const networkSchema = {
    // trigger when list new a exchange
    create: joi_1.default.object().keys({
        symbol: joi_1.default.string().uppercase().min(3).max(10).required(),
        fullname: joi_1.default.string().uppercase().min(3).max(70).required(),
        network: joi_1.default.string().valid('mainnet', 'testnet').required(),
        user_id: joi_1.default.string().required(),
        chainId: joi_1.default.number().positive().greater(0).less(1000).optional(),
        walletSupport: joi_1.default.string().valid('sol', 'tron', 'eth').required(),
        BlockExplorerURL: joi_1.default.string().uri().required(),
        rpcUrl: joi_1.default.string().uri().required(),
    }),
    // get specfic token token
    blogLIST: {
        page: joi_1.default.number().required(),
        pageSize: joi_1.default.number().required(),
    },
};
exports.default = networkSchema;

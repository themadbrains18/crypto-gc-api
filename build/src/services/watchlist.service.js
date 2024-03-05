"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const watchlist_dal_1 = __importDefault(require("../models/dal/watchlist.dal"));
const aes_1 = __importDefault(require("crypto-js/aes"));
const crypto_js_1 = require("crypto-js");
class watchlistServices {
    async create(payload) {
        return await watchlist_dal_1.default.create(payload);
    }
    async listById(user_id) {
        return await watchlist_dal_1.default.watchlistListById(user_id);
    }
    async decrypt(payload) {
        try {
            let key = process.env.ENCRYPTION_KEY;
            let pass = aes_1.default.decrypt(payload, key).toString(crypto_js_1.enc.Utf8);
            return pass;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = watchlistServices;

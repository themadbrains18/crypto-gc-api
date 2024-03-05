"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_token_model_1 = __importDefault(require("../model/global_token.model"));
const tokens_model_1 = __importDefault(require("../model/tokens.model"));
const watchlist_model_1 = __importDefault(require("../model/watchlist.model"));
class watchlistDal {
    /**
     * create new token
     * @param payload
     * @returns
     */
    async create(payload) {
        try {
            return await watchlist_model_1.default.create(payload);
        }
        catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    async watchlistListById(user_id) {
        try {
            let list = await watchlist_model_1.default.findAll({ where: { user_id: user_id }, include: [
                    {
                        model: tokens_model_1.default
                    },
                    {
                        model: global_token_model_1.default
                    }
                ] });
            return list;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = new watchlistDal();

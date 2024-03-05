"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_list_dal_1 = __importDefault(require("../models/dal/token_list.dal"));
class tokenListingService {
    async create(payload) {
        return await token_list_dal_1.default.create(payload);
    }
    async ifTokenExist(name) {
        return token_list_dal_1.default.checkTokenExist(name);
    }
    async getTokenList() {
        return token_list_dal_1.default.getListOfToken();
    }
}
exports.default = tokenListingService;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../../services/service"));
const tokenListing_model_1 = __importDefault(require("../model/tokenListing.model"));
class tokenListingDal {
    async create(payload) {
        try {
            let isExist = await service_1.default.token_list.ifTokenExist(payload.symbol);
            if (isExist == false) {
                return await tokenListing_model_1.default.create(payload);
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async checkTokenExist(name) {
        try {
            let data = await tokenListing_model_1.default.findOne({ where: { symbol: name } });
            let token = data?.dataValues;
            if (token) {
                throw new Error('THis token is already exist.');
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getListOfToken() {
        try {
            return await tokenListing_model_1.default.findAll();
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = new tokenListingDal();

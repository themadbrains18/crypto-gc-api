"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const network_model_1 = __importDefault(require("../model/network.model"));
class networkDal {
    /**
     * return all tokens data
     * @returns
     */
    async all() {
        return await network_model_1.default.findAll();
    }
    async networkById(payload) {
        return await network_model_1.default.findOne({ where: { id: payload }, raw: true });
    }
    /**
     * create new token
     * @param payload
     * @returns
     */
    async createNetwork(payload) {
        try {
            return await network_model_1.default.create(payload);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = new networkDal();

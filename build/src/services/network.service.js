"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const network_dal_1 = __importDefault(require("../models/dal/network.dal"));
class networkServices {
    /**
     *
     * @returns return all published token
     */
    async all() {
        return await network_dal_1.default.all();
    }
    async networkById(payload) {
        return await network_dal_1.default.networkById(payload);
    }
    /**
     *
     * @param payload
     * @returns
     */
    async create(payload) {
        try {
            return await network_dal_1.default.createNetwork(payload);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = networkServices;

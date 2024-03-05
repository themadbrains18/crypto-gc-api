"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const futurePair_dal_1 = __importDefault(require("../models/dal/futurePair.dal"));
class futureTradePairServices {
    /**
     *
     * @returns return all published token
     */
    async all() {
        return await futurePair_dal_1.default.all();
    }
    async allByLimit(offset, limit) {
        return await futurePair_dal_1.default.allByLimit(offset, limit);
    }
    /**
     *
     * @param payload if token contarct alread register
     * @returns
     */
    async alreadyExist(payload) {
        return await futurePair_dal_1.default.pairIfExist(payload);
    }
    /**
     *
     * @param payload
     * @returns
     */
    async create(payload) {
        return await futurePair_dal_1.default.createPair(payload);
    }
    /**
     * Active/Inactive token list by admin
     */
    async changeStatus(payload) {
        return await futurePair_dal_1.default.changeStatus(payload);
    }
    async edit(payload) {
        return await futurePair_dal_1.default.editPair(payload);
    }
}
exports.default = futureTradePairServices;

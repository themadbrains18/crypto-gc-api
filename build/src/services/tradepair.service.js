"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tradepair_dal_1 = __importDefault(require("../models/dal/tradepair.dal"));
class tradePairServices {
    /**
     *
     * @returns return all published token
     */
    async all() {
        return await tradepair_dal_1.default.all();
    }
    async allByLimit(offset, limit) {
        return await tradepair_dal_1.default.allByLimit(offset, limit);
    }
    /**
     *
     * @param payload if token contarct alread register
     * @returns
     */
    async alreadyExist(payload) {
        return await tradepair_dal_1.default.pairIfExist(payload);
    }
    /**
     *
     * @param payload
     * @returns
     */
    async create(payload) {
        return await tradepair_dal_1.default.createPair(payload);
    }
    /**
     * Active/Inactive token list by admin
     */
    async changeStatus(payload) {
        return await tradepair_dal_1.default.changeStatus(payload);
    }
    async edit(payload) {
        return await tradepair_dal_1.default.editPair(payload);
    }
}
exports.default = tradePairServices;

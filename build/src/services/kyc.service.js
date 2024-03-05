"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kyc_dal_1 = __importDefault(require("../models/dal/kyc.dal"));
class kycServices {
    /**
     *
     * @param payload if token contarct alread register
     * @returns
     */
    async alreadyExist(payload) {
        return await kyc_dal_1.default.kycIfExist(payload);
    }
    /**
     *
     * @param payload
     * @returns
     */
    async create(payload) {
        return await kyc_dal_1.default.createKyc(payload);
    }
    async edit(payload) {
        return await kyc_dal_1.default.editKyc(payload);
    }
    /**
     * update kyc status
     * @param payload
     * @returns
     */
    async updateStatus(payload) {
        return await kyc_dal_1.default.updateKycStatus(payload);
    }
    /**
     * get kyc by user id
     * @param user_id
     * @returns
     */
    async getKycById(user_id) {
        return await kyc_dal_1.default.kycById(user_id);
    }
    /**
     * get all kyc records
     * @param type
     * @returns
     */
    async getAllKyc(type) {
        return await kyc_dal_1.default.all(type);
    }
    async getAllKycByLimit(type, offset, limit) {
        return await kyc_dal_1.default.allByLimit(type, offset, limit);
    }
}
exports.default = kycServices;

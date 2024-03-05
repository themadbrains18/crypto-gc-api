"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kyc_model_1 = __importDefault(require("../model/kyc.model"));
const interface_1 = require("../../utils/interface");
class kycDal {
    /**
     * return all KYC data for admin dashboard
     * @returns
     */
    async all(type) {
        if (type === interface_1.Direction.All || type === interface_1.Direction.Blank) {
            return await kyc_model_1.default.findAll({ raw: true });
        }
        if (type === interface_1.Direction.Pending || type === interface_1.Direction.Approved) {
            return await kyc_model_1.default.findAll({ where: { isVerified: type === interface_1.Direction.Pending ? false : true, isReject: false } });
        }
        if (type === interface_1.Direction.Rejected) {
            return await kyc_model_1.default.findAll({ where: { isReject: true } });
        }
    }
    async allByLimit(type, offset, limit) {
        let offsets = parseInt(offset);
        let limits = parseInt(limit);
        if (type === interface_1.Direction.All || type === interface_1.Direction.Blank) {
            return await kyc_model_1.default.findAll({
                raw: true,
                limit: limits,
                offset: offsets
            });
        }
        if (type === interface_1.Direction.Pending || type === interface_1.Direction.Approved) {
            return await kyc_model_1.default.findAll({ where: { isVerified: type === interface_1.Direction.Pending ? false : true, isReject: false } });
        }
        if (type === interface_1.Direction.Rejected) {
            return await kyc_model_1.default.findAll({ where: { isReject: true } });
        }
    }
    /**
     * get kyc data by id
     * @param user_id
     * @returns
     */
    async kycById(user_id) {
        return await kyc_model_1.default.findOne({ where: { userid: user_id }, raw: true });
    }
    /**
   * check exissting kyc of user
   * @param payload
   * @returns
   */
    async kycIfExist(payload) {
        if (payload?.userid != undefined && payload?.userid != "") {
            let data = await kyc_model_1.default.findAll({
                where: {
                    "userid": payload?.userid
                }
            });
            return data;
        }
        return [];
    }
    /**
     * create new kyc
     * @param payload
     * @returns
     */
    async createKyc(payload) {
        return await kyc_model_1.default.create(payload);
    }
    async editKyc(payload) {
        let result = await kyc_model_1.default.update({ isVerified: false, isReject: false }, { where: { userid: payload?.userid } });
        if (result.length > 0) {
            return await this.kycById(payload.userid);
        }
    }
    /**
     * update kyc status by admin
     * @param payload
     * @returns
     */
    async updateKycStatus(payload) {
        let result = await kyc_model_1.default.update({ isVerified: payload.isVerified, isReject: payload.isReject }, { where: { userid: payload.userid } });
        if (result.length > 0) {
            return await this.kycById(payload.userid);
        }
    }
}
exports.default = new kycDal();

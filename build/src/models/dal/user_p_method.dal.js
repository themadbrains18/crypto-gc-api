"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_p_method_1 = __importDefault(require("../model/user_p_method"));
const users_model_1 = __importDefault(require("../model/users.model"));
const p_method_model_1 = __importDefault(require("../model/p_method.model"));
const service_1 = __importDefault(require("../../services/service"));
class userPaymentMethodDal {
    /**
     * Create user payment methods
     * @param payload
     * @returns
     */
    async create(payload) {
        try {
            let passCodeVerify = await users_model_1.default.findOne({
                where: { id: payload.user_id },
                attributes: {
                    exclude: ['id', 'dial_code', 'password', 'otpToken', 'cronStatus', 'deletedAt', 'TwoFA', 'kycstatus', 'statusType', 'registerType', 'role', 'secret', 'own_code', 'refeer_code', 'antiphishing', 'createdAt', 'updatedAt', 'UID']
                },
                raw: true
            });
            let pass = service_1.default.bcypt.MDB_compareHash(`${payload?.pmObject?.passcode}`, passCodeVerify.tradingPassword);
            let userOtp = {
                username: passCodeVerify?.email ? passCodeVerify?.email : passCodeVerify?.number,
                otp: payload?.otp,
            };
            let result = await service_1.default.otpService.matchOtp(userOtp);
            if (pass && result.success === true) {
                return await user_p_method_1.default.create(payload);
            }
            else {
                if (pass === false) {
                    throw new Error('Trading password you enter not correct.Please verify trading password');
                }
                if (result.success === false) {
                    throw new Error(result?.message);
                }
            }
        }
        catch (err) {
            throw new Error(err);
        }
    }
    /**
     * Get payment methods by user id
     * @param payload
     * @returns
     */
    async getUserMethod(payload) {
        try {
            return await user_p_method_1.default.findAll({
                where: { user_id: payload },
                include: [
                    {
                        model: p_method_model_1.default,
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "deletedAt"]
                        },
                    }
                ]
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * Remove user payment method
     * @param payload
     * @returns
     */
    async removeUserMethodById(payload) {
        try {
            return await user_p_method_1.default.destroy({ where: { id: payload } });
        }
        catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
}
exports.default = new userPaymentMethodDal();

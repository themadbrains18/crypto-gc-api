"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
const models_1 = require("../models");
// import { validate } from 'crypto-address-validator-ts';
class withdrawController extends main_controller_1.default {
    async executeImpl(req, res) {
        try {
            // ... Handle request by creating objects
        }
        catch (error) {
            return this.fail(res, error.toString());
        }
    }
    /**
     *
     * @param req
     * @param res
     */
    async addnewRequest(req, res) {
        try {
            let payload = req.body;
            let network = await models_1.networkModel.findOne({ where: { id: payload.networkId }, raw: true });
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                "address": `${payload.withdraw_wallet}`,
                "currency": `${network?.symbol.toLowerCase()}`
            });
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            let validAddress = await fetch("https://checkcryptoaddress.com/api/check-address", requestOptions);
            let isValid = await validAddress.json();
            if (isValid.data.isValid === true && payload.step === 1) {
                return super.ok(res, 'valid');
            }
            else if (payload.step === 1) {
                return super.fail(res, 'Invalid Address');
            }
            let userOtp;
            if (payload?.otp === '' || payload?.otp === 'string' || payload.otp === null) {
                userOtp = { username: req?.body?.username };
                let otp = await service_1.default.otpGenerate.createOtpForUser(userOtp);
                // const emailTemplate = service.emailTemplate.otpVerfication(`${otp}`);
                // service.emailService.sendMail(req.headers["X-Request-Id"], {
                //   to: userOtp.username,
                //   subject: "Verify OTP",
                //   html: emailTemplate.html,
                // });
                super.ok(res, { message: "OTP sent in your inbox. Please verify your otp", otp });
            }
            else {
                //  send email otp to user
                if (req.body?.otp) {
                    userOtp = {
                        username: req?.body?.username,
                        otp: req.body?.otp,
                    };
                    let result = await service_1.default.otpService.matchOtp(userOtp);
                    if (result.success === true) {
                        let responseData = await service_1.default.withdrawServices.create(payload);
                        super.ok(res, responseData);
                    }
                    else {
                        super.fail(res, result.message);
                    }
                }
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *
     * @param req
     * @param res
     */
    async withdrawListbyUserID(req, res) {
        try {
            let responseData = await service_1.default.withdrawServices.listById(req.params.userid);
            super.ok(res, responseData);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async userWithdrawHistory(req, res) {
        try {
            let responseData = await service_1.default.withdrawServices.historyById(req.params.userid);
            super.ok(res, responseData);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async userWithdrawHistoryByLimit(req, res) {
        try {
            let { offset, limit } = req?.params;
            let responseData = await service_1.default.withdrawServices.historyById(req.params.userid);
            let responseDataPaginate = await service_1.default.withdrawServices.historyByIdLimit(req.params.userid, offset, limit);
            super.ok(res, { data: responseDataPaginate, total: responseData.length });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     * admin get all withdrawList
     * @param req
     * @param res
     */
    async withdrawList(req, res) {
        try {
            let withdrawResponse = await service_1.default.withdrawServices.getwithdrawList();
            super.ok(res, withdrawResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *
     * admin get all withdrawListByLimit
     * @param req
     * @param res
     */
    async withdrawListByLImit(req, res) {
        try {
            let { offset, limit } = req.params;
            let withdrawResponse = await service_1.default.withdrawServices.getwithdrawList();
            let withdrawResponseByLimit = await service_1.default.withdrawServices.getwithdrawListByLimit(offset, limit);
            super.ok(res, { data: withdrawResponseByLimit, total: withdrawResponse.length });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
}
exports.default = withdrawController;

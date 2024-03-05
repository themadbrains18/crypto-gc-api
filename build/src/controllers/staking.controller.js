"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
const models_1 = require("../models");
const interface_1 = require("../utils/interface");
class stakingController extends main_controller_1.default {
    /**
   * get user assets list here
   * @param req
   * @param res
   */
    async saveStaking(req, res, next) {
        try {
            let staking = req.body;
            let stakingResponse = await service_1.default.staking.create(staking);
            super.ok(res, { message: "Staking Added successfully!.", result: stakingResponse });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * get user assets list here
     * @param req
     * @param res
     */
    async stakingRelease(req, res) {
        try {
            let stak = await models_1.stakingModel.findOne({ where: { status: true, queue: true, redeem: false, id: req?.body?.id }, raw: true });
            if (stak && req.body?.step === 1) {
                return super.ok(res, { result: "Stake is ready for redeem!!" });
            }
            let userOtp;
            if (req.body?.otp === "string" ||
                req.body?.otp === "" ||
                req.body?.otp === null) {
                userOtp = { username: req.body?.username };
                let otp = await service_1.default.otpGenerate.createOtpForUser(userOtp);
                // const emailTemplate = service.emailTemplate.otpVerfication(`${otp}`);
                // service.emailService.sendMail(req.headers["X-Request-Id"], {
                //   to: userOtp.username,
                //   subject: "Verify OTP",
                //   html: emailTemplate.html,
                // });
                // Return a 200
                super.ok(res, { result: "OTP sent in your inbox. Please verify your otp to redeem assets", otp });
            }
            else {
                if (req.body?.otp) {
                    userOtp = {
                        username: req.body?.username,
                        otp: req.body?.otp,
                    };
                    let result = await service_1.default.otpService.matchOtp(userOtp);
                    if (result.success === true) {
                        let stakingResponse = await service_1.default.staking.releaseStaking(req.body.id);
                        super.ok(res, { message: "Staking release successfully!.", result: stakingResponse });
                    }
                    else {
                        return super.fail(res, result.message);
                    }
                }
            }
        }
        catch (error) {
            return super.fail(res, error.message);
        }
    }
    /**
     * get user assets list here
     * @param req
     * @param res
     */
    async getAllStaking(req, res) {
        try {
            let stakingResponse = await service_1.default.staking.getAllStaking(req?.body?.user_id);
            super.ok(res, stakingResponse);
        }
        catch (error) {
        }
    }
    /**
     * get user assets list here
     * @param req
     * @param res
     */
    async getStakedByToken(req, res) {
        let stakingResponse = await service_1.default.staking.getStakingByToken(req.params.tokenid, req.params.userid);
        super.ok(res, stakingResponse);
    }
    async unstakingToken(req, res) {
        try {
            let stak = await models_1.stakingModel.findOne({ where: { status: false, queue: false, redeem: false, unstacking: false, id: req?.body?.id }, raw: true });
            if (stak) {
                let assetData = await models_1.assetModel.findOne({ where: { token_id: stak.token_id, user_id: stak.user_id, walletTtype: interface_1.assetsWalletType.main_wallet }, raw: true });
                if (assetData) {
                    let bal = assetData.balance + (stak.amount);
                    await models_1.assetModel.update({ balance: bal }, { where: { token_id: stak.token_id, user_id: stak.user_id, walletTtype: interface_1.assetsWalletType.main_wallet } });
                }
                await models_1.stakingModel.update({ unstacking: true }, { where: { status: false, queue: false, redeem: false, unstacking: false, id: req?.body?.id } });
                stak.unstacking = true;
                return super.ok(res, { result: stak, message: 'Token unstake successfully!!.' });
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    // =============================================================
    // Admin Api to token stake add
    // =============================================================
    async saveTokenStake(req, res, next) {
        try {
            let staking = req.body;
            let stakingResponse = await service_1.default.staking.createStake(staking);
            if (stakingResponse) {
                let tokens = await service_1.default.token.adminTokenAll();
                return super.ok(res, { message: "Staking Added successfully!.", result: tokens });
            }
            // super.ok<any>(res, { message: "Staking Added successfully!.", result: stakingResponse });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = stakingController;

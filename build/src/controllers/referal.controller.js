"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
const models_1 = require("../models");
class ReferalController extends main_controller_1.default {
    async executeImpl(req, res) {
        try {
            // ... Handle request by creating objects
        }
        catch (error) {
            return super.fail(res, error.toString());
        }
    }
    async getUserReferalList(req, res, next) {
        try {
            let user = await models_1.referUserModel.findAll({
                where: { referral_user: req.params.userid },
                include: [
                    {
                        model: models_1.userModel,
                        attributes: {
                            exclude: [
                                "deletedAt",
                                "cronStatus",
                                "createdAt",
                                "updatedAt",
                                "UID",
                                "antiphishing",
                                "registerType",
                                "statusType",
                                "tradingPassword",
                                "kycstatus",
                                "password", "otpToken", "own_code", "pin_code", "secret", "TwoFA"
                            ],
                        },
                        include: [{ model: models_1.depositModel }, { model: models_1.marketOrderModel }]
                    },
                    { model: models_1.referProgramInviteModel }
                ]
            });
            return super.ok(res, user);
        }
        catch (error) {
            return super.fail(res, error.message);
        }
    }
    async getUserReferalListByLimit(req, res, next) {
        try {
            let { offset, limit } = req?.params;
            let user = await models_1.userModel.findOne({
                where: { id: req.params.userid },
                raw: true,
            });
            if (user) {
                let referUser = await service_1.default.referalService.getReferalByreferCode(user?.own_code);
                let referUserList = await service_1.default.referalService.getReferalByreferCodeByLimit(user?.own_code, offset, limit);
                return super.ok(res, { data: referUserList, total: referUser?.length });
            }
            else {
                return super.fail(res, "user not found");
            }
        }
        catch (error) {
            return super.fail(res, error.message);
        }
    }
    async getUserRewards(req, res, next) {
        try {
            let response = await service_1.default.referalService.getUserRewards(req.params.userid);
            if (response) {
                super.ok(res, response);
            }
        }
        catch (error) {
            return super.fail(res, error.message);
        }
    }
    async createUserRewards(req, res, next) {
        try {
            let response = await service_1.default.referalService.createUserRewards(req.body);
            if (response) {
                super.ok(res, response);
            }
        }
        catch (error) {
            return super.fail(res, error.message);
        }
    }
    async updateUserRewards(req, res, next) {
        try {
            let response = await service_1.default.referalService.updateUserRewards(req.body);
            if (response) {
                super.ok(res, response);
            }
        }
        catch (error) {
            return super.fail(res, error.message);
        }
    }
    async getRewardsDetailById(req, res, next) {
        try {
            let response = await service_1.default.referalService.getRewardsDetailById(req.params.userid, req.params.rewardid);
            if (response) {
                super.ok(res, response);
            }
        }
        catch (error) {
            return super.fail(res, error.message);
        }
    }
}
exports.default = ReferalController;

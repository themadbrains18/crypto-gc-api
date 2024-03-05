"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const rewards_dal_1 = __importDefault(require("../models/dal/rewards.dal"));
class ReferalService {
    async getReferalByreferCode(refeer_code) {
        try {
            let allList = [];
            let directRefer = await models_1.userModel.findAll({
                where: { refeer_code: refeer_code },
                attributes: {
                    exclude: [
                        "deletedAt",
                        "password",
                        "cronStatus",
                        "updatedAt",
                        "UID",
                        "antiphishing",
                        "secret",
                        "registerType",
                        "statusType",
                        "tradingPassword",
                        "kycstatus",
                        "TwoFA",
                    ],
                },
                raw: true
            });
            allList = directRefer;
            for await (const user of directRefer) {
                let subRefer = await models_1.userModel.findAll({
                    where: { refeer_code: user.own_code },
                    attributes: {
                        exclude: [
                            "deletedAt",
                            "password",
                            "cronStatus",
                            "updatedAt",
                            "UID",
                            "antiphishing",
                            "secret",
                            "registerType",
                            "statusType",
                            "tradingPassword",
                            "kycstatus",
                            "TwoFA",
                        ],
                    },
                    raw: true
                });
                if (subRefer) {
                    for (const subuser of subRefer) {
                        allList.push(subuser);
                    }
                }
            }
            return allList;
        }
        catch (error) {
            return error.message;
        }
    }
    async getReferalByreferCodeByLimit(refeer_code, offset, limit) {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            let allList = [];
            let directRefer = await models_1.userModel.findAll({
                where: { refeer_code: refeer_code },
                attributes: {
                    exclude: [
                        "deletedAt",
                        "password",
                        "cronStatus",
                        "updatedAt",
                        "UID",
                        "antiphishing",
                        "secret",
                        "registerType",
                        "statusType",
                        "tradingPassword",
                        "kycstatus",
                        "TwoFA",
                    ],
                },
                raw: true,
                limit: limits,
                offset: offsets
            });
            allList = directRefer;
            for await (const user of directRefer) {
                let subRefer = await models_1.userModel.findAll({
                    where: { refeer_code: user.own_code },
                    attributes: {
                        exclude: [
                            "deletedAt",
                            "password",
                            "cronStatus",
                            "updatedAt",
                            "UID",
                            "antiphishing",
                            "secret",
                            "registerType",
                            "statusType",
                            "tradingPassword",
                            "kycstatus",
                            "TwoFA",
                        ],
                    },
                    raw: true,
                    limit: limits,
                    offset: offsets
                });
                if (subRefer) {
                    for (const subuser of subRefer) {
                        allList.push(subuser);
                    }
                }
            }
            return allList;
        }
        catch (error) {
            return error.message;
        }
    }
    async getUserRewards(payload) {
        return await rewards_dal_1.default.getUserRewards(payload);
    }
    async createUserRewards(payload) {
        return await rewards_dal_1.default.createUserRewards(payload);
    }
    async updateUserRewards(payload) {
        return await rewards_dal_1.default.updateUserRewards(payload);
    }
    async getRewardsDetailById(userid, rewardid) {
        return await rewards_dal_1.default.getRewardsDetailById(userid, rewardid);
    }
}
exports.default = ReferalService;

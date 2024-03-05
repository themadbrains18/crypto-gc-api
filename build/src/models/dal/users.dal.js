"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importStar(require("../index"));
const sequelize_1 = require("sequelize");
const marketProfit_model_1 = __importDefault(require("../model/marketProfit.model"));
const service_1 = __importDefault(require("../../services/service"));
// interface MarketProfitOuput {
//   totalProfit: number;
//   coin_type: string;
//   totalFees: number;
//   totalFeesInUsdt: number;
// }
class userDal {
    create = async (payload) => {
        try {
            const users = (await index_1.userModel.create(payload)).get({ plain: true });
            if (users) {
                let referUser = await index_1.userModel.findOne({ where: { own_code: users.refeer_code }, raw: true });
                if (referUser) {
                    let programEVent = await index_1.referProgramInviteModel.findOne({ where: { referral_id: payload?.referral_id }, raw: true });
                    let obj = {
                        user_id: users?.id,
                        referral_user: referUser?.id,
                        event_id: programEVent?.id
                    };
                    await index_1.referUserModel.create(obj);
                    // create entry for welcome rewards
                    let welcomeObj = {
                        user_id: users?.id,
                        type: 'Coupon',
                        amount: 10,
                        description: 'Welcome Gift',
                        coupan_code: await service_1.default.otpGenerate.referalCodeGenerate()
                    };
                    await index_1.userRewardModel.create(welcomeObj);
                }
            }
            return users;
        }
        catch (error) {
            throw new Error(error.message);
        }
    };
    userAlreadyExist = async (id) => {
        try {
            const user = await index_1.userModel.findOne({
                where: {
                    [sequelize_1.Op.or]: [{ number: id }, { email: id }],
                },
            });
            return user;
        }
        catch (error) {
            throw new Error(error.message);
        }
    };
    login = async (payload) => {
        let condition = {};
        let number = (payload.number === "string") ? "" : payload.number;
        let email = (payload.email === "string") ? "" : payload.email;
        if (number !== "" && email !== "") {
            condition = { number: number, email: email };
        }
        else if (email !== "") {
            condition = { email: email };
        }
        else if (number !== "") {
            condition = { number: number };
        }
        let users = await index_1.userModel.findOne({
            where: condition,
            attributes: {
                exclude: [
                    "deletedAt",
                    "cronStatus",
                    "createdAt",
                    "UID",
                    "antiphishing",
                    "registerType",
                    "statusType",
                    "tradingPassword",
                    "kycstatus",
                ],
            },
            raw: true,
        });
        return users;
    };
    checkUserByPk = async (id) => {
        const user = await index_1.userModel.findOne({
            where: { id: id },
            raw: true
        });
        return user;
    };
    async getListOfUser() {
        try {
            return await index_1.userModel.findAll({
                include: {
                    model: index_1.walletsModel,
                }
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getListOfUserByLimit(offset, limit) {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            return await index_1.userModel.findAll({
                include: {
                    model: index_1.walletsModel,
                },
                limit: limits,
                offset: offsets,
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getListOfAdminProfit() {
        try {
            return await marketProfit_model_1.default.findAll({
                attributes: [
                    [index_1.default.fn('SUM', index_1.default.col('profit')), 'profit'],
                    'coin_type',
                    [index_1.default.fn('SUM', index_1.default.col('fees')), 'fees'],
                    [index_1.default.fn('SUM', index_1.default.col('listing_fee')), 'listing_fee'],
                ],
                group: ['coin_type'],
                raw: true
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getListOfUserActivity() {
        try {
            return await index_1.lastLoginModel.findAll({ raw: true });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getListOfUserActivityByLimit(offset, limit) {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            return await index_1.lastLoginModel.findAll({
                limit: limits,
                offset: offsets
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getListOfUserActivityByIdLimit(userid, offset, limit) {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            return await index_1.lastLoginModel.findAll({
                where: { user_id: userid },
                limit: limits,
                offset: offsets
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async clearAllUserActivity(user_id) {
        try {
            let response = await index_1.lastLoginModel.destroy({ where: { user_id: user_id } });
            return true;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getUserDetailAllActivity(user_id) {
        try {
            return await index_1.userModel.findOne({
                where: { id: user_id },
                attributes: {
                    exclude: [
                        "password",
                        "deletedAt",
                        "cronStatus",
                        "updatedAt",
                        "createdAt",
                        "createdAt",
                        "UID",
                        "antiphishing",
                        "registerType",
                        "statusType",
                        "tradingPassword",
                        "kycstatus",
                        "TwoFA",
                        "otpToken", "own_code",
                        "refeer_code", "secret"
                    ],
                },
                include: [
                    { model: index_1.assetModel, include: [{ model: index_1.tokensModel }, { model: index_1.globalTokensModel }] },
                    { model: index_1.withdrawModel, include: [{ model: index_1.tokensModel }, { model: index_1.globalTokensModel }] },
                    { model: index_1.depositModel },
                    { model: index_1.marketOrderModel, include: [{ model: index_1.tokensModel }, { model: index_1.globalTokensModel }] },
                    { model: index_1.orderModel, include: [{ model: index_1.tokensModel }, { model: index_1.globalTokensModel }] },
                    { model: index_1.lastLoginModel },
                ]
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = userDal;

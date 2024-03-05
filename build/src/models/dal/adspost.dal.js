"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../../services/service"));
const interface_1 = require("../../utils/interface");
const assets_model_1 = __importDefault(require("../model/assets.model"));
const global_token_model_1 = __importDefault(require("../model/global_token.model"));
const kyc_model_1 = __importDefault(require("../model/kyc.model"));
const p_method_model_1 = __importDefault(require("../model/p_method.model"));
const post_model_1 = __importDefault(require("../model/post.model"));
const profile_model_1 = __importDefault(require("../model/profile.model"));
const tokens_model_1 = __importDefault(require("../model/tokens.model"));
const user_p_method_1 = __importDefault(require("../model/user_p_method"));
const users_model_1 = __importDefault(require("../model/users.model"));
class adsPostDal {
    /**
     * Create ads post by user to sell assets by P2P method
     * @param payload
     * @returns
     */
    async create(payload) {
        try {
            let userVerify = await users_model_1.default.findOne({
                where: { id: payload.user_id },
                attributes: {
                    exclude: ['id', 'number', 'email', 'dial_code', 'password', 'otpToken', 'cronStatus', 'deletedAt', 'TwoFA', 'statusType', 'registerType', 'role', 'secret', 'own_code', 'refeer_code', 'antiphishing', 'createdAt', 'updatedAt', 'UID']
                },
                raw: true
            });
            let userAssets = await assets_model_1.default.findOne({ where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: interface_1.assetsWalletType.main_wallet }, raw: true });
            let pass = service_1.default.bcypt.MDB_compareHash(`${payload.fundcode}`, userVerify.tradingPassword);
            if (pass === false) {
                throw new Error('Trading password you enter not correct.Please verify trading password');
            }
            if (userVerify?.kycstatus !== "approve") {
                throw new Error('Your kyc not completed. Please contact with administrator!!!');
            }
            if (userAssets != null && userAssets.balance < payload.quantity) {
                throw new Error('You have unsufficiant balance!!.');
            }
            let post = await post_model_1.default.create(payload);
            if (post) {
                let newBal = userAssets?.balance - payload.quantity;
                // console.log(newBal,'===============new Balance');
                await assets_model_1.default.update({ balance: newBal }, { where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: interface_1.assetsWalletType.main_wallet } });
                return post;
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * Get ads post of specific user_id
     * @param payload
     * @returns
     */
    async getUserAdsPost(payload) {
        try {
            let posts = await post_model_1.default.findAll({
                where: { user_id: payload }, include: [
                    {
                        model: tokens_model_1.default,
                        attributes: {
                            exclude: [
                                "fullName", "minimum_withdraw", "decimals", "tokenType", "status", "networks", "type", "createdAt", "updatedAt", "deletedAt"
                            ]
                        }
                    },
                    {
                        model: global_token_model_1.default,
                        attributes: {
                            exclude: [
                                "fullName", "minimum_withdraw", "decimals", "tokenType", "status", "networks", "type", "createdAt", "updatedAt", "deletedAt"
                            ]
                        }
                    },
                    {
                        model: users_model_1.default,
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
                        }
                    }
                ]
            });
            return posts;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * Get all post create by users
     * @returns
     */
    async getAllAdsPost() {
        try {
            return await post_model_1.default.findAll({ where: { status: true },
                include: [
                    {
                        model: tokens_model_1.default,
                        attributes: {
                            exclude: [
                                "fullName", "minimum_withdraw", "decimals", "tokenType", "status", "networks", "type", "createdAt", "updatedAt", "deletedAt"
                            ]
                        }
                    },
                    {
                        model: global_token_model_1.default,
                        attributes: {
                            exclude: [
                                "fullName", "minimum_withdraw", "decimals", "tokenType", "status", "networks", "type", "createdAt", "updatedAt", "deletedAt"
                            ]
                        }
                    },
                    {
                        model: users_model_1.default,
                        attributes: {
                            exclude: [
                                "otpToken", "dial_code", "password", "TwoFA", "kycstatus", "tradingPassword", "statusType", "registerType", "role", "secret", "own_code", "refeer_code", "antiphishing", "UID", "cronStatus", "createdAt", "updatedAt", "deletedAt"
                            ]
                        },
                        include: [
                            {
                                model: kyc_model_1.default,
                                attributes: {
                                    exclude: [
                                        "id", "user_id", "doctype", "docnumber", "dob", "idfront", "idback", "statement", "isVerified", "isReject", "destinationPath", "createdAt", "updatedAt", "deletedAt"
                                    ]
                                }
                            },
                            {
                                model: profile_model_1.default
                            },
                            {
                                model: user_p_method_1.default,
                                include: [
                                    {
                                        model: p_method_model_1.default,
                                        attributes: {
                                            exclude: ["createdAt", "updatedAt", "deletedAt"]
                                        },
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * Delete ads post
     * @param post_id
     * @param user_id
     * @returns
     */
    async deletePostByUserPostId(post_id, user_id) {
        try {
            let post = await post_model_1.default.findOne({ where: { id: post_id, user_id: user_id }, raw: true });
            if (post != null) {
                let balance = post.quantity;
                let userAssets = await assets_model_1.default.findOne({ where: { user_id: user_id, token_id: post.token_id, walletTtype: interface_1.assetsWalletType.main_wallet }, raw: true });
                let deletePost = await post_model_1.default.destroy({ where: { id: post_id } });
                if (userAssets != null && deletePost != null) {
                    await assets_model_1.default?.update({ balance: userAssets.balance + parseFloat(balance.toString()) }, { where: { id: userAssets?.id, user_id: user_id } });
                    return post;
                }
                else {
                    if (userAssets === null) {
                        throw new Error('You have no any wallet selected.');
                    }
                }
            }
            else {
                throw new Error('Selected post ads not exist. Please verify your ads.');
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     *
     * @param post_id
     * @param user_id
     * @returns
     */
    async getSingleAds(post_id, user_id) {
        try {
            return await post_model_1.default.findOne({ where: { id: post_id, user_id: user_id },
                include: [
                    {
                        model: tokens_model_1.default,
                        attributes: {
                            exclude: [
                                "fullName", "minimum_withdraw", "decimals", "tokenType", "status", "networks", "type", "createdAt", "updatedAt", "deletedAt"
                            ]
                        }
                    },
                    {
                        model: users_model_1.default,
                        attributes: {
                            exclude: [
                                "otpToken", "dial_code", "password", "TwoFA", "kycstatus", "tradingPassword", "statusType", "registerType", "role", "secret", "own_code", "refeer_code", "antiphishing", "UID", "cronStatus", "createdAt", "updatedAt", "deletedAt"
                            ]
                        },
                        include: [
                            {
                                model: user_p_method_1.default,
                                include: [
                                    {
                                        model: p_method_model_1.default,
                                        attributes: {
                                            exclude: ["createdAt", "updatedAt", "deletedAt"]
                                        },
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = new adsPostDal();

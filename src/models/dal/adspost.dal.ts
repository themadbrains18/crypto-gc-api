import service from "../../services/service";
import { assetsAccountType, assetsWalletType } from "../../utils/interface";
import adsPostDto from "../dto/adspost.dto";
import assetModel from "../model/assets.model";
import globalTokensModel from "../model/global_token.model";
import kycModel from "../model/kyc.model";
import paymentMethodModel from "../model/p_method.model";
import postModel, { postInput, postOuput } from "../model/post.model";
import profileModel from "../model/profile.model";
import tokensModel from "../model/tokens.model";
import userPmethodModel from "../model/user_p_method";
import userModel from "../model/users.model";
import tokenDal from "./token.dal";

class adsPostDal {

    /**
     * Create ads post by user to sell assets by P2P method
     * @param payload 
     * @returns 
     */
    async create(payload: adsPostDto): Promise<postOuput | any> {
        try {
            let userVerify = await userModel.findOne({
                where: { id: payload.user_id },
                attributes: {
                    exclude: ['id', 'number', 'email', 'dial_code', 'password', 'otpToken', 'cronStatus', 'deletedAt', 'TwoFA', 'statusType', 'registerType', 'role', 'secret', 'own_code', 'refeer_code', 'antiphishing', 'createdAt', 'updatedAt', 'UID']
                },
                raw: true
            });
            let userAssets: any = await assetModel.findOne({ where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: assetsWalletType.main_wallet }, raw: true });

            let pass = service.bcypt.MDB_compareHash(
                `${payload.fundcode}`,
                userVerify!.tradingPassword
            );

            if (pass === false) {
                throw new Error('Trading password you enter not correct.Please verify trading password');
            }
            if (userVerify?.kycstatus !== "approve") {
                throw new Error('Your kyc not completed. Please contact with administrator!!!');
            }

            if (userAssets != null && userAssets!.balance < payload.quantity) {
                throw new Error('You have unsufficiant balance!!.');
            }
            let post = await postModel.create(payload);

            if (post) {
                let newBal = userAssets?.balance - payload.quantity;

                await assetModel.update({ balance: newBal }, { where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: assetsWalletType.main_wallet } });
                return post;
            }
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    /**
     * Get ads post of specific user_id
     * @param payload 
     * @returns 
     */
    async getUserAdsPost(payload: string): Promise<postOuput | any> {
        try {
            let posts: any = await postModel.findAll({
                where: { user_id: payload }, include: [
                    {
                        model: tokensModel,
                        attributes: {
                            exclude: [
                                "fullName", "minimum_withdraw", "decimals", "tokenType", "status", "networks", "type", "createdAt", "updatedAt", "deletedAt"
                            ]
                        }
                    },
                    {
                        model: globalTokensModel,
                        attributes: {
                            exclude: [
                                "fullName", "minimum_withdraw", "decimals", "tokenType", "status", "networks", "type", "createdAt", "updatedAt", "deletedAt"
                            ]
                        }
                    },
                    {
                        model: userModel,
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
            })
            return posts;

        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    /**
     * Get all post create by users
     * @returns 
     */
    async getAllAdsPost(): Promise<postOuput | any> {
        try {
            return await postModel.findAll({
                where: { status: true },
                include: [
                    {
                        model: tokensModel,
                        attributes: {
                            exclude: [
                                "fullName", "minimum_withdraw", "decimals", "tokenType", "status", "networks", "type", "createdAt", "updatedAt", "deletedAt"
                            ]
                        }
                    },
                    {
                        model: globalTokensModel,
                        attributes: {
                            exclude: [
                                "fullName", "minimum_withdraw", "decimals", "tokenType", "status", "networks", "type", "createdAt", "updatedAt", "deletedAt"
                            ]
                        }
                    },
                    {
                        model: userModel,
                        attributes: {
                            exclude: [
                                "otpToken", "dial_code", "password", "TwoFA", "kycstatus", "tradingPassword", "statusType", "registerType", "role", "secret", "own_code", "refeer_code", "antiphishing", "UID", "cronStatus", "createdAt", "updatedAt", "deletedAt"
                            ]
                        },
                        include: [
                            {
                                model: kycModel,
                                attributes: {
                                    exclude: [
                                        "id", "user_id", "doctype", "docnumber", "dob", "idfront", "idback", "statement", "isVerified", "isReject", "destinationPath", "createdAt", "updatedAt", "deletedAt"
                                    ]
                                }
                            },
                            {
                                model: profileModel
                            },
                            {
                                model: userPmethodModel,
                                include: [
                                    {
                                        model: paymentMethodModel,
                                        attributes: {
                                            exclude: ["createdAt", "updatedAt", "deletedAt"]
                                        },
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    /**
     * Delete ads post
     * @param post_id 
     * @param user_id 
     * @returns 
     */
    async deletePostByUserPostId(post_id: string, user_id: string): Promise<postOuput | any> {

        try {
            let post = await postModel.findOne({ where: { id: post_id, user_id: user_id }, raw: true });
            if (post != null) {
                let balance: number = post.quantity;
                let userAssets = await assetModel.findOne({ where: { user_id: user_id, token_id: post.token_id, walletTtype: assetsWalletType.main_wallet }, raw: true });
                let deletePost = await postModel.destroy({ where: { id: post_id } });
                if (userAssets != null && deletePost != null) {
                    await assetModel?.update({ balance: userAssets.balance + parseFloat(balance.toString()) }, { where: { id: userAssets?.id, user_id: user_id } });
                    return post;
                }
                else {
                    if (userAssets === null) {
                        throw new Error('You have no any wallet selected.');
                    }
                }
            }
            else {
                throw new Error('Selected post ads not exist. Please verify your ads.')
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * 
     * @param post_id 
     * @param user_id 
     * @returns 
     */
    async getSingleAds(post_id: string, user_id: string): Promise<postOuput | any> {
        try {
            return await postModel.findOne({
                where: { id: post_id, user_id: user_id },
                include: [
                    {
                        model: tokensModel,
                        attributes: {
                            exclude: [
                                "fullName", "minimum_withdraw", "decimals", "tokenType", "status", "networks", "type", "createdAt", "updatedAt", "deletedAt"
                            ]
                        }
                    },
                    {
                        model: userModel,
                        attributes: {
                            exclude: [
                                "otpToken", "dial_code", "password", "TwoFA", "kycstatus", "tradingPassword", "statusType", "registerType", "role", "secret", "own_code", "refeer_code", "antiphishing", "UID", "cronStatus", "createdAt", "updatedAt", "deletedAt"
                            ]
                        },
                        include: [
                            {
                                model: userPmethodModel,
                                include: [
                                    {
                                        model: paymentMethodModel,
                                        attributes: {
                                            exclude: ["createdAt", "updatedAt", "deletedAt"]
                                        },
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}

export default new adsPostDal();
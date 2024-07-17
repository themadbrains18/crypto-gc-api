import { Op } from "sequelize";
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
import orderModel from "../model/order.model";
import sequelize from "sequelize";


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
    async getUserAds(payload: string): Promise<postOuput | any> {
        try {
            return await postModel.findAll({
                where: {
                    user_id: {
                        [Op.ne]: payload // Assuming 'payload' contains the user_id to exclude
                    },
                    status: true
                },
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
                        ],
                    }
                ],

            })


        } catch (error: any) {
            throw new Error(error.message)
        }
    }
    /**
     * Get ads post of specific user_id
     * @param payload 
     * @returns 
     */
    async getUserAdsPost(payload: string, offset: number, limit: number): Promise<postOuput | any> {
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
                        },

                    }
                ],
                limit: Number(limit),  // Add limit for pagination
                offset: Number(offset)
            })
            const totalLength = await postModel.count({ where: { user_id: payload } });
            return { data: posts, total: totalLength };

        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    // /**
    //  * Get all post create by users
    //  * @returns 
    //  */
    // async getAllAdsPost(userid: string | undefined, offset: number, limit: number,currency:string,pmMethod:string): Promise<{ data: any[], totalLength: number }> {
    //     try {
    //         let whereClause: any = { status: true };

    //         if (userid !== undefined && userid !== 'undefined') {
    //             whereClause.user_id = { [Op.not]: userid };
    //         }

    //         const data = await postModel.findAll({
    //             where: whereClause,
    //             include: [
    //                 {
    //                     model: tokensModel,
    //                     attributes: {
    //                         exclude: [
    //                             "fullName", "minimum_withdraw", "decimals", "tokenType", "status", "networks", "type", "createdAt", "updatedAt", "deletedAt"
    //                         ]
    //                     }
    //                 },
    //                 {
    //                     model: globalTokensModel,
    //                     attributes: {
    //                         exclude: [
    //                             "fullName", "minimum_withdraw", "decimals", "tokenType", "status", "networks", "type", "createdAt", "updatedAt", "deletedAt"
    //                         ]
    //                     }
    //                 },
    //                 {
    //                     model: userModel,
    //                     attributes: {
    //                         exclude: [
    //                             "otpToken", "dial_code", "password", "TwoFA", "kycstatus", "tradingPassword", "statusType", "registerType", "role", "secret", "own_code", "refeer_code", "antiphishing", "UID", "cronStatus", "createdAt", "updatedAt", "deletedAt"
    //                         ]
    //                     },
    //                     include: [
    //                         {
    //                             model: kycModel,
    //                             attributes: {
    //                                 exclude: [
    //                                     "id", "user_id", "doctype", "docnumber", "dob", "idfront", "idback", "statement", "isVerified", "isReject", "destinationPath", "createdAt", "updatedAt", "deletedAt"
    //                                 ]
    //                             }
    //                         },
    //                         {
    //                             model: profileModel
    //                         },
    //                         {
    //                             model: userPmethodModel,
    //                             include: [
    //                                 {
    //                                     model: paymentMethodModel,
    //                                     attributes: {
    //                                         exclude: ["createdAt", "updatedAt", "deletedAt"]
    //                                     },
    //                                 }
    //                             ]
    //                         }

    //                     ],
    //                 },],


    //             limit: Number(limit),  // Add limit for pagination
    //             offset: Number(offset)  // Add offset for pagination
    //         });

    //         const totalLength = await postModel.count({ where: whereClause });

    //         return { data: data, totalLength: totalLength };
    //     } catch (error: any) {
    //         throw new Error(error.message);
    //     }
    // }

    async getAllAdsPost(userid: string | undefined, offset: number, limit: number, currency: string, pmMethod: string): Promise<{ data: any[], totalLength: number }> {
        try {
            let whereClause: any = {
                status: true,
                quantity: { [Op.gt]: 0 }
            };

            if (userid !== undefined && userid !== 'undefined') {
                whereClause.user_id = { [Op.not]: userid };
            }

            // Add currency filter if not 'all'
            if (currency && currency !== 'all') {
                whereClause.token_id = currency;
            }

            // Prepare include for filtering based on payment method
            let userPaymentMethods = await userPmethodModel.findAll({
                where: pmMethod !== 'all' ? { pmid: pmMethod } : {},
                raw: true,
                attributes: { exclude: ["user_id", "pmid", "status", "pm_name", "pmObject", "createdAt", "updatedAt", "deletedAt"] }
            });

            const pMethodIds = userPaymentMethods.map(upm => upm.id);

            // Construct the conditions for JSON_CONTAINS
            const jsonContainsConditions = pMethodIds.length > 0 ? pMethodIds.map(id => ({
                [Op.and]: sequelize.literal(`JSON_CONTAINS(p_method, '{"upm_id": "${id}"}')`)
            })) : [];

            // Fetch all filtered records to get the total length
            const allFilteredRecords = await postModel.findAll({
                where: {
                    ...whereClause,

                    [Op.or]: jsonContainsConditions,

                },
                include: [
                    {
                        model: tokensModel,
                        attributes: {
                            exclude: ["fullName", "minimum_withdraw", "decimals", "tokenType", "status", "networks", "type", "createdAt", "updatedAt", "deletedAt"]
                        }
                    },
                    {
                        model: globalTokensModel,
                        attributes: {
                            exclude: ["fullName", "minimum_withdraw", "decimals", "tokenType", "status", "networks", "type", "createdAt", "updatedAt", "deletedAt"]
                        }
                    },
                    {
                        model: userModel,
                        attributes: {
                            exclude: ["otpToken", "dial_code", "password", "TwoFA", "kycstatus", "tradingPassword", "statusType", "registerType", "role", "secret", "own_code", "refeer_code", "antiphishing", "UID", "cronStatus", "createdAt", "updatedAt", "deletedAt"]
                        },
                        include: [
                            {
                                model: kycModel,
                                attributes: {
                                    exclude: ["id", "user_id", "doctype", "docnumber", "dob", "idfront", "idback", "statement", "isVerified", "isReject", "destinationPath", "createdAt", "updatedAt", "deletedAt"]
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
                        ],
                    }
                ],
            });

            // Get total length of filtered records
            const totalLength = allFilteredRecords.length;

            // Paginate the filtered records
            const paginatedData = allFilteredRecords.slice(offset, offset + limit);

            return { data: paginatedData, totalLength: totalLength };
        } catch (error: any) {
            console.error("Error:", error.message);
            throw new Error(error.message);
        }
    }

    /**
     * Get all post create by users and post status
     * @returns 
     */
    async getUserPostByStatus(payload: string, status: string, offset: number, limit: number, currency: string, pmMethod: string, date: string): Promise<{ data: any[], totalLength: number }> {
        try {
            // console.log("here in ad post dal",date);
            
            let whereClause: any = {
                user_id: payload,
              
            };

            console.log("=here i am",date);
            

            if (status !== "all") {
                whereClause.status = status === "true" ? true : false;
                whereClause.quantity = {
                    [Op.gt]: 0
                };
           
            }

            if (currency && currency !== 'all') {
                whereClause.token_id = currency;
            }

            // Prepare include for filtering based on payment method
            let userPaymentMethods = await userPmethodModel.findAll({
                where: pmMethod !== 'all' ? { pmid: pmMethod } : {},
                raw: true,
                attributes: { exclude: ["user_id", "pmid", "status", "pm_name", "pmObject", "createdAt", "updatedAt", "deletedAt"] }
            });

            const pMethodIds = userPaymentMethods.map(upm => upm.id);

            // Construct the conditions for JSON_CONTAINS
            const jsonContainsConditions = pMethodIds.length > 0 ? pMethodIds.map(id => ({
                [Op.and]: sequelize.literal(`JSON_CONTAINS(p_method, '{"upm_id": "${id}"}')`)
            })) : [];

            if (date && date !== "all") {
                whereClause.createdAt = {
                    [Op.gte]: new Date(date as string) // Filter posts from the given date
                };
            }
            let posts: any = await postModel.findAll({
                where: {
                    ...whereClause,
                    [Op.or]: jsonContainsConditions
                }, include: [
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
                ],
                // limit: Number(limit),  // Add limit for pagination
                // offset: Number(offset)
            })
        
            const totalLength = posts.length;

            // Paginate the filtered records
            const paginatedData = posts.slice(offset, offset + limit);

            return { data: paginatedData, totalLength: totalLength };

        } catch (error: any) {
            // console.log(error.message,"==message");
            
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


    async getTotalOrdersByUser(userid: string): Promise<number> {
        try {
            if (userid === "") {
                throw new Error('Please provide userid.');
            }

            // Query to count orders where the user is a seller or buyer
            let totalOrders = await orderModel.count({
                where: {
                    [Op.or]: [
                        { sell_user_id: userid },
                        { buy_user_id: userid }
                    ],

                    [Op.and]: [
                        { status: { [Op.ne]: 'isCanceled' } },
                        { status: { [Op.ne]: 'isProcess' } }
                    ]

                }
            });

            return totalOrders;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default new adsPostDal();
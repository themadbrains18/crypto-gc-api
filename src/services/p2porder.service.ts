import { Op } from "sequelize";
import p2porderDal from "../models/dal/p2porder.dal";
import P2POrderDto from "../models/dto/p2porder.dto";
import orderModel, { orderOuput } from "../models/model/order.model";
import sequelize, { kycModel, paymentMethodModel, postModel, tokensModel, userModel, userPmethodModel } from "../models";
import profileModel from "../models/model/profile.model";

class p2pOrderService {

    async createOrder(payload: P2POrderDto): Promise<orderOuput | any> {
        return await p2porderDal.create(payload);
    }

    async cancelOrder(payload: any): Promise<orderOuput | any> {
        console.log('=========order cancel 2');
        return await p2porderDal.cancelOrder(payload);
    }

    async updateOrder(payload: any): Promise<orderOuput | any> {
        return await p2porderDal.updateOrder(payload);
    }

    async orderReleased(payload: any): Promise<orderOuput | any> {
        return await p2porderDal.orderReleased(payload);
    }

    /**
     * check cancel order by user on same day
     * @param user_id 
     * @returns 
     */
    async checkCancelOrderCurrentDay(user_id: string): Promise<orderOuput | any> {

        const START = new Date();
        START.setHours(0, 0, 0, 0);
        const NOW = new Date();
        let orders = await orderModel.findAll({
            where: {
                buy_user_id: user_id, status: "isCanceled", createdAt: {
                    [Op.between]: [START.toISOString(), NOW.toISOString()]
                }
            }
        });
        return orders;
    }

    /**
     * Check Reserve order by user on same post
     * @param post_id 
     * @returns 
     */
    async checkReserveOrderByPost(post_id: string): Promise<orderOuput | any> {
        let order = await orderModel.findAll(
            {
                attributes: ['post_id', [
                    sequelize.fn('sum', sequelize.col('quantity')), 'total']
                ],
                group: ['post_id'],
                where: {
                    post_id: post_id,
                    [Op.or]: [
                        { status: 'isProcess' },
                        { status: 'isCompleted' }
                    ]
                }
            });
        return order;
    }

    /**
     * Get order by order id
     * @param payload 
     * @returns 
     */
    async getOrderByid(payload: string): Promise<orderOuput | any> {
        try {
            let order = await orderModel.findOne({
                where: { id: payload },
                include: [
                    {
                        model: postModel,
                        attributes: {
                            exclude: [
                                "user_id", "token_id", "price", "quantity", "min_limit", "max_limit", "checked", "status", "createdAt", "updatedAt", "deletedAt"
                            ]
                        },
                        include: [
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
                        ]
                    }
                ]
            });
            return order?.dataValues;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getOrderList(userid: string): Promise<orderOuput | any> {
        try {
            if (userid === "") {
                throw new Error('Please provide userid.')
            }
            return await orderModel.findAll({
                where: {
                    [Op.or]: [
                        { buy_user_id: userid },
                        { sell_user_id: userid }
                    ]
                },
                include: [
                    {
                        model: postModel,
                        attributes: {
                            exclude: [
                                "user_id", "token_id", "price", "quantity", "min_limit", "max_limit", "checked", "status", "createdAt", "updatedAt", "deletedAt"
                            ]
                        },
                        include: [
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
                                    }
                                ]
                            }
                        ]
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
                            }
                        ]
                    }
                ],
                order: [["createdAt", "desc"]]
            });
        } catch (error: any) {
            throw new Error(error.message);
        }

    }
    async getOrderListByLimit(userid: string, offset: string, limit: string): Promise<orderOuput | any> {
        try {

            let limits = parseInt(limit)
            let offsets = parseInt(offset)

            if (userid === "") {
                throw new Error('Please provide userid.')
            }
            return await orderModel.findAll({
                where: {
                    [Op.or]: [
                        { buy_user_id: userid },
                        { sell_user_id: userid }
                    ]
                },
                include: {
                    model: tokensModel
                },
                limit: limits,
                offset: offsets

            });
        } catch (error: any) {
            throw new Error(error.message);
        }

    }
    async getOrderListByStatusByLimit(userid: string, status: string, offset: string, limit: string, currency:string, date:string): Promise<orderOuput | any> {
        try {

            console.log("========date",date);
            
            let limits = parseInt(limit)
            let offsets = parseInt(offset)

            if (userid === "") {
                throw new Error('Please provide userid.')
            }
            let whereClause: any = {
                [Op.or]: [
                    { buy_user_id: userid },
                    { sell_user_id: userid }
                ]
            };

            if (status === "isReleased") {
                whereClause.status = { [Op.or]: ['isReleased', 'isCompleted'] };
            } else if (status !== "all") {
                whereClause.status = status;
            }

            if (currency && currency !== 'all') {
                whereClause.token_id = currency;
            }
            if (date && date !=="all") {
                whereClause.createdAt = {
                    [Op.gte]: new Date(date as string) // Filter posts from the given date
                };
            }
    
            // Query to fetch paginated data
            let data = await orderModel.findAll({
                where: {
                    ...whereClause,
        
                },
                include: {
                    model: tokensModel
                }
            });

            // Query to fetch total count
         // Get total length of filtered records
         
         const totalLength = data.length;
    
         // Paginate the filtered records
         const paginatedData = data.slice(offsets, offsets + limits);
 
         return { data: paginatedData, total: totalLength };
           
        } catch (error: any) {
            console.log("eror", error.message);
            
            throw new Error(error.message);
        }

    }
    async getAllOrderList(): Promise<orderOuput | any> {
        try {

            return await orderModel.findAll
                ({
                    include: {
                        model: tokensModel
                    }
                });
        } catch (error: any) {
            throw new Error(error.message);
        }

    }
    async getAllOrderListByLimit(offset: string, limit: string): Promise<orderOuput | any> {
        try {

            let offsets = parseInt(offset);
            let limits = parseInt(limit)

            return await orderModel.findAll
                ({
                    include: {
                        model: tokensModel
                    },
                    limit: limits,
                    offset: offsets

                });
        } catch (error: any) {
            throw new Error(error.message);
        }

    }
}

export default p2pOrderService;
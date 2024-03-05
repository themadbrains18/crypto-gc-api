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
const sequelize_1 = require("sequelize");
const p2porder_dal_1 = __importDefault(require("../models/dal/p2porder.dal"));
const order_model_1 = __importDefault(require("../models/model/order.model"));
const models_1 = __importStar(require("../models"));
const profile_model_1 = __importDefault(require("../models/model/profile.model"));
class p2pOrderService {
    async createOrder(payload) {
        return await p2porder_dal_1.default.create(payload);
    }
    async cancelOrder(payload) {
        return await p2porder_dal_1.default.cancelOrder(payload);
    }
    async updateOrder(payload) {
        return await p2porder_dal_1.default.updateOrder(payload);
    }
    async orderReleased(payload) {
        return await p2porder_dal_1.default.orderReleased(payload);
    }
    /**
     * check cancel order by user on same day
     * @param user_id
     * @returns
     */
    async checkCancelOrderCurrentDay(user_id) {
        const START = new Date();
        START.setHours(0, 0, 0, 0);
        const NOW = new Date();
        let orders = await order_model_1.default.findAll({
            where: {
                buy_user_id: user_id, status: "isCanceled", createdAt: {
                    [sequelize_1.Op.between]: [START.toISOString(), NOW.toISOString()]
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
    async checkReserveOrderByPost(post_id) {
        let order = await order_model_1.default.findAll({
            attributes: ['post_id', [
                    models_1.default.fn('sum', models_1.default.col('quantity')), 'total'
                ]
            ],
            group: ['post_id'],
            where: {
                post_id: post_id,
                [sequelize_1.Op.or]: [
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
    async getOrderByid(payload) {
        try {
            let order = await order_model_1.default.findOne({
                where: { id: payload },
                include: [
                    {
                        model: models_1.postModel,
                        attributes: {
                            exclude: [
                                "user_id", "token_id", "price", "quantity", "min_limit", "max_limit", "checked", "status", "createdAt", "updatedAt", "deletedAt"
                            ]
                        },
                        include: [
                            {
                                model: models_1.userModel,
                                attributes: {
                                    exclude: [
                                        "otpToken", "dial_code", "password", "TwoFA", "kycstatus", "tradingPassword", "statusType", "registerType", "role", "secret", "own_code", "refeer_code", "antiphishing", "UID", "cronStatus", "createdAt", "updatedAt", "deletedAt"
                                    ]
                                },
                                include: [
                                    {
                                        model: models_1.kycModel,
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
                                        model: models_1.userPmethodModel,
                                        include: [
                                            {
                                                model: models_1.paymentMethodModel,
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
                        model: models_1.userModel,
                        attributes: {
                            exclude: [
                                "otpToken", "dial_code", "password", "TwoFA", "kycstatus", "tradingPassword", "statusType", "registerType", "role", "secret", "own_code", "refeer_code", "antiphishing", "UID", "cronStatus", "createdAt", "updatedAt", "deletedAt"
                            ]
                        },
                        include: [
                            {
                                model: models_1.kycModel,
                                attributes: {
                                    exclude: [
                                        "id", "user_id", "doctype", "docnumber", "dob", "idfront", "idback", "statement", "isVerified", "isReject", "destinationPath", "createdAt", "updatedAt", "deletedAt"
                                    ]
                                }
                            },
                            {
                                model: profile_model_1.default
                            },
                        ]
                    }
                ]
            });
            return order?.dataValues;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getOrderList(userid) {
        try {
            if (userid === "") {
                throw new Error('Please provide userid.');
            }
            return await order_model_1.default.findAll({
                where: { [sequelize_1.Op.or]: [
                        { buy_user_id: userid },
                        { sell_user_id: userid }
                    ] },
                include: [
                    {
                        model: models_1.postModel,
                        attributes: {
                            exclude: [
                                "user_id", "token_id", "price", "quantity", "min_limit", "max_limit", "checked", "status", "createdAt", "updatedAt", "deletedAt"
                            ]
                        },
                        include: [
                            {
                                model: models_1.userModel,
                                attributes: {
                                    exclude: [
                                        "otpToken", "dial_code", "password", "TwoFA", "kycstatus", "tradingPassword", "statusType", "registerType", "role", "secret", "own_code", "refeer_code", "antiphishing", "UID", "cronStatus", "createdAt", "updatedAt", "deletedAt"
                                    ]
                                },
                                include: [
                                    {
                                        model: models_1.kycModel,
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
                        model: models_1.userModel,
                        attributes: {
                            exclude: [
                                "otpToken", "dial_code", "password", "TwoFA", "kycstatus", "tradingPassword", "statusType", "registerType", "role", "secret", "own_code", "refeer_code", "antiphishing", "UID", "cronStatus", "createdAt", "updatedAt", "deletedAt"
                            ]
                        },
                        include: [
                            {
                                model: models_1.kycModel,
                                attributes: {
                                    exclude: [
                                        "id", "user_id", "doctype", "docnumber", "dob", "idfront", "idback", "statement", "isVerified", "isReject", "destinationPath", "createdAt", "updatedAt", "deletedAt"
                                    ]
                                }
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
    async getOrderListByLimit(userid, offset, limit) {
        try {
            let limits = parseInt(limit);
            let offsets = parseInt(offset);
            if (userid === "") {
                throw new Error('Please provide userid.');
            }
            return await order_model_1.default.findAll({
                where: { [sequelize_1.Op.or]: [
                        { buy_user_id: userid },
                        { sell_user_id: userid }
                    ] },
                include: {
                    model: models_1.tokensModel
                },
                limit: limits,
                offset: offsets
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getAllOrderList() {
        try {
            return await order_model_1.default.findAll({
                include: {
                    model: models_1.tokensModel
                }
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getAllOrderListByLimit(offset, limit) {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            return await order_model_1.default.findAll({
                include: {
                    model: models_1.tokensModel
                },
                limit: limits,
                offset: offsets
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = p2pOrderService;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assets_model_1 = __importDefault(require("../model/assets.model"));
const global_token_model_1 = __importDefault(require("../model/global_token.model"));
const marketProfit_model_1 = __importDefault(require("../model/marketProfit.model"));
const network_model_1 = __importDefault(require("../model/network.model"));
const tokens_model_1 = __importDefault(require("../model/tokens.model"));
const withdraw_model_1 = __importDefault(require("../model/withdraw.model"));
class withdrawDal {
    /**
     * create new withdraw request
     * @param payload
     * @returns
     */
    async createWithdrawRequest(payload) {
        try {
            let apiResponse;
            let WithdrawResponse = await withdraw_model_1.default.create(payload);
            if (WithdrawResponse) {
                let getassets = await assets_model_1.default.findOne({ where: { token_id: payload?.tokenID, user_id: payload?.user_id }, raw: true });
                if (getassets) {
                    let updatebalance = getassets?.balance - payload?.amount;
                    let balUpdate = await assets_model_1.default.update({ balance: updatebalance }, { where: { id: getassets?.id } });
                    if (balUpdate) {
                        apiResponse = WithdrawResponse;
                    }
                    // =========================================================//
                    // ================Fee Deduction from user and add to admin=================//
                    // =========================================================//
                    try {
                        let profit = {
                            source_id: WithdrawResponse?.dataValues?.id,
                            total_usdt: 0,
                            paid_usdt: 0,
                            admin_usdt: 0,
                            buyer: WithdrawResponse?.dataValues?.user_id,
                            seller: WithdrawResponse?.dataValues?.user_id,
                            profit: 0,
                            fees: parseFloat(payload?.fee),
                            coin_type: WithdrawResponse?.dataValues?.symbol,
                            source_type: 'Withdraw',
                        };
                        await marketProfit_model_1.default.create(profit);
                    }
                    catch (error) {
                        throw new Error(error.message);
                    }
                }
            }
            return apiResponse;
        }
        catch (error) {
            console.log(error);
        }
    }
    withdrawListById = async (id) => {
        try {
            let wallet = await withdraw_model_1.default.findAll({
                where: { user_id: id },
                attributes: {
                    exclude: ['id', 'deletedAt', 'updatedAt']
                },
                order: [["createdAt", "desc"]],
                raw: true
            });
            let data = wallet;
            return data;
        }
        catch (error) {
            throw new Error(error.message);
        }
    };
    async getListOfWithdraw() {
        try {
            return await withdraw_model_1.default.findAll({
                include: [{
                        model: network_model_1.default,
                        attributes: {
                            exclude: [
                                "chainId", "BlockExplorerURL", "rpcUrl", "walletSupport", "network", "symbol", "user_id", "status", "createdAt", "updatedAt", "deletedAt"
                            ]
                        }
                    },
                    {
                        model: tokens_model_1.default
                    },
                    {
                        model: global_token_model_1.default
                    }
                ],
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getListOfWithdrawByLimit(offset, limit) {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            return await withdraw_model_1.default.findAll({
                include: [{
                        model: network_model_1.default,
                        attributes: {
                            exclude: [
                                "chainId", "BlockExplorerURL", "rpcUrl", "walletSupport", "network", "symbol", "user_id", "status", "createdAt", "updatedAt", "deletedAt"
                            ]
                        }
                    },
                    {
                        model: tokens_model_1.default
                    },
                    {
                        model: global_token_model_1.default
                    }
                ], limit: limits,
                offset: offsets,
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    withdrawHistoryById = async (id) => {
        try {
            let wallet = await withdraw_model_1.default.findAll({
                where: { user_id: id },
                include: [{
                        model: network_model_1.default,
                        attributes: {
                            exclude: [
                                "chainId", "rpcUrl", "walletSupport", "network", "symbol", "user_id", "status", "createdAt", "updatedAt", "deletedAt"
                            ]
                        }
                    },
                    {
                        model: tokens_model_1.default
                    },
                    {
                        model: global_token_model_1.default
                    }
                ],
                order: [["createdAt", "desc"]]
            });
            let data = wallet;
            return data;
        }
        catch (error) {
            throw new Error(error.message);
        }
    };
    withdrawHistoryByIdLimit = async (id, offset, limit) => {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            let wallet = await withdraw_model_1.default.findAll({
                where: { user_id: id },
                include: [{
                        model: network_model_1.default,
                        attributes: {
                            exclude: [
                                "chainId", "BlockExplorerURL", "rpcUrl", "walletSupport", "network", "symbol", "user_id", "status", "createdAt", "updatedAt", "deletedAt"
                            ]
                        }
                    },
                    {
                        model: tokens_model_1.default
                    },
                    {
                        model: global_token_model_1.default
                    }
                ],
                order: [["createdAt", "desc"]],
                limit: limits,
                offset: offsets
            });
            let data = wallet;
            return data;
        }
        catch (error) {
            throw new Error(error.message);
        }
    };
}
exports.default = new withdrawDal();

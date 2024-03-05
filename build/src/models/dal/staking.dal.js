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
const staking_model_1 = __importDefault(require("../model/staking.model"));
const main_controller_1 = __importDefault(require("../../controllers/main.controller"));
const assets_model_1 = __importDefault(require("../model/assets.model"));
const interface_1 = require("../../utils/interface");
const tokens_model_1 = __importDefault(require("../model/tokens.model"));
const index_1 = __importStar(require("../index"));
const service_1 = __importDefault(require("../../services/service"));
class stakingDal extends main_controller_1.default {
    /**
     *
     * @param payload
     * @returns
     */
    async createStaking(payload) {
        try {
            let availableAssets = await assets_model_1.default.findOne({ where: { token_id: payload.token_id, user_id: payload.user_id, walletTtype: interface_1.assetsWalletType.main_wallet }, raw: true });
            if (availableAssets != null && availableAssets.balance > 0 && availableAssets.balance > payload.amount) {
                let createResponse = await staking_model_1.default.create(payload);
                let updateAssetsResponse = assets_model_1.default.update({ balance: availableAssets.balance - payload.amount }, { where: { token_id: payload.token_id, user_id: payload.user_id, walletTtype: interface_1.assetsWalletType.main_wallet } });
                return createResponse;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    /**
     * Get all staking list
     * @returns
     */
    async getAllStaking(user_id) {
        try {
            return await staking_model_1.default.findAll({
                where: { user_id: user_id },
                include: [
                    {
                        model: tokens_model_1.default,
                        attributes: {
                            exclude: [
                                "deletedAt",
                                "createdAt",
                                "createdAt",
                                "updatedAt",
                                "networks",
                                "minimum_withdraw",
                                "decimals",
                                "tokenType",
                                "status",
                                "price",
                                "min_price",
                                "max_price",
                                "type",
                                "maxSupply",
                                "totalSupply",
                                "circulatingSupply",
                                "rank",
                            ],
                        },
                    },
                    {
                        model: index_1.globalTokensModel,
                        attributes: {
                            exclude: [
                                "deletedAt",
                                "createdAt",
                                "createdAt",
                                "updatedAt",
                                "networks",
                                "minimum_withdraw",
                                "decimals",
                                "tokenType",
                                "status",
                                "price",
                                "min_price",
                                "max_price",
                                "type",
                                "maxSupply",
                                "totalSupply",
                                "circulatingSupply",
                                "rank",
                            ],
                        },
                    }
                ]
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    /**
     * Get staking tokan data by user and token id
     * @param token_id
     * @param user_id
     * @returns
     */
    async getStakingDataByTokenId(token_id, user_id) {
        try {
            let data = await staking_model_1.default.findAll({
                attributes: [[index_1.default.fn('sum', index_1.default.col('amount')), 'total']],
                where: { user_id: user_id, token_id: token_id, redeem: false }
            });
            return data;
        }
        catch (error) {
        }
    }
    /**
     * Cron on all staking to update status according staking time complete
     */
    async cronStaking() {
        try {
            // console.log('staking cron call every 5 second')
            let record = await staking_model_1.default.findAll({ where: { status: false, queue: false } });
            for await (const stak of record) {
                await stak.update({ queue: true });
                var d = new Date(stak.createdAt);
                let currentDate = new Date();
                if (stak.time_format === interface_1.stakingTimeFormat.Minutes) {
                    d.setMinutes(d.getMinutes() + stak.time_log);
                }
                if (stak.time_format === interface_1.stakingTimeFormat.Days) {
                    d.setDate(d.getDate() + stak.time_log);
                }
                else if (stak.time_format === interface_1.stakingTimeFormat.Months) {
                    d.setMonth(d.getMonth() + stak.time_log);
                }
                else if (stak.time_format === interface_1.stakingTimeFormat.Years) {
                    d.setFullYear(d.getFullYear() + stak.time_log);
                }
                let flag = await service_1.default.staking.compareDates(d, currentDate);
                // console.log(flag,'=========flag');
                if (flag === true) {
                    await stak.update({ status: true });
                }
                else {
                    await stak.update({ queue: false });
                }
            }
        }
        catch (error) {
            console.log(error, 'cron staking error');
        }
    }
    async releaseStaking(payload) {
        try {
            let responseApi;
            let stak = await staking_model_1.default.findOne({ where: { status: true, queue: true, redeem: false, id: payload }, raw: true });
            if (stak) {
                //==============================
                //Yearly, monthly,days annual interest rate calculation here 
                //==============================
                let assetData = await assets_model_1.default.findOne({ where: { token_id: stak.token_id, user_id: stak.user_id, walletTtype: interface_1.assetsWalletType.main_wallet }, raw: true });
                if (assetData) {
                    let bal = assetData.balance + (stak.amount);
                    await assets_model_1.default.update({ balance: bal }, { where: { token_id: stak.token_id, user_id: stak.user_id, walletTtype: interface_1.assetsWalletType.main_wallet } });
                    await staking_model_1.default.update({ redeem: true }, { where: { status: true, queue: true, redeem: false, id: payload } });
                    stak.redeem = true;
                }
            }
            return stak;
        }
        catch (error) {
            throw new Error(error?.message);
        }
    }
    /**
     * create Admin Staking
     * @param payload
     * @returns
     */
    async createAdminStaking(payload) {
        try {
            let apiStatus;
            let stake = await index_1.tokenstakeModel.findOne({ where: { token_id: payload.token_id }, raw: true });
            if (stake) {
                let createResponse = await index_1.tokenstakeModel.update(payload, { where: { id: stake?.id } });
                if (createResponse) {
                    apiStatus = await index_1.tokenstakeModel.findOne({ where: { token_id: payload.token_id }, raw: true });
                }
            }
            else {
                apiStatus = await index_1.tokenstakeModel.create(payload);
            }
            return apiStatus;
        }
        catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
}
exports.default = new stakingDal();

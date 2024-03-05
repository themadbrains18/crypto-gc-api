"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assets_model_1 = __importDefault(require("../model/assets.model"));
const tokens_model_1 = __importDefault(require("../model/tokens.model"));
const interface_1 = require("../../utils/interface");
const main_controller_1 = __importDefault(require("../../controllers/main.controller"));
const transferhistory_model_1 = __importDefault(require("../model/transferhistory.model"));
const global_token_model_1 = __importDefault(require("../model/global_token.model"));
const tokenstake_model_1 = __importDefault(require("../model/tokenstake.model"));
const tradePair_model_1 = __importDefault(require("../model/tradePair.model"));
const futuretrade_model_1 = __importDefault(require("../model/futuretrade.model"));
class assetsDal extends main_controller_1.default {
    /**
     *
     * @param payload
     * @returns
     */
    async createAssets(payload) {
        try {
            let token = tokens_model_1.default.findAll({ where: { id: payload.token_id } });
            if ((await token).length > 0) {
                let assetData = await assets_model_1.default.findOne({ where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: payload.walletTtype }, raw: true });
                if (assetData) {
                    let bal = payload.balance + assetData.balance;
                    await assets_model_1.default.update({ balance: bal }, { where: { id: assetData?.id, user_id: payload.user_id, token_id: payload.token_id, walletTtype: payload.walletTtype } });
                    return assetData.balance = bal;
                    ;
                }
                return await assets_model_1.default.create(payload);
            }
            token = global_token_model_1.default.findAll({ where: { id: payload.token_id } });
            if ((await token).length > 0) {
                let assetData = await assets_model_1.default.findOne({ where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: payload.walletTtype }, raw: true });
                if (assetData) {
                    let bal = payload.balance + assetData.balance;
                    await assets_model_1.default.update({ balance: bal }, { where: { id: assetData?.id, user_id: payload.user_id, token_id: payload.token_id, walletTtype: payload.walletTtype } });
                    return assetData.balance = bal;
                }
                return await assets_model_1.default.create(payload);
            }
            else {
                return new Error("token not found");
            }
        }
        catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    /**
     *
     * @param payload
     * @returns
     */
    async walletTowalletTranserfer(payload) {
        try {
            let token = await tokens_model_1.default.findOne({ where: { id: payload.token_id }, raw: true });
            if (token === null) {
                token = await global_token_model_1.default.findOne({ where: { id: payload.token_id }, raw: true });
            }
            if (token) {
                //================================
                // get all wallet_from type assets
                //================================
                let fromAssets = await assets_model_1.default.findOne({ where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: payload.from }, raw: true });
                //==============================
                // get all wallet_to type assets
                //==============================
                let toAssets = await assets_model_1.default.findOne({ where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: payload.to }, raw: true });
                if (!!fromAssets && fromAssets?.balance > 0 && fromAssets.balance >= payload.balance) {
                    //==========================
                    //update wallet_from assests
                    //==========================
                    await assets_model_1.default.update({ balance: fromAssets.balance - payload.balance }, { where: { id: fromAssets?.id } });
                    //=========================================
                    // Wallet to wallet Transfer history create
                    //=========================================
                    await transferhistory_model_1.default.create(payload);
                    //==========================
                    //update wallet_to assests 
                    //==========================
                    if (!!toAssets) {
                        await assets_model_1.default.update({ balance: toAssets.balance + payload.balance }, { where: { id: toAssets?.id } });
                        toAssets.balance = toAssets.balance + payload.balance;
                        return toAssets;
                    }
                    else {
                        let assets = {
                            walletTtype: payload.to,
                            balance: payload.balance,
                            account_type: '',
                            token_id: payload.token_id,
                            user_id: payload.user_id
                        };
                        let account_type = interface_1.assetsAccountType.main_account;
                        if (interface_1.assetsWalletType.funding_wallet === payload.to) {
                            account_type = interface_1.assetsAccountType.funding_account;
                        }
                        assets.account_type = account_type;
                        return await assets_model_1.default.create(assets);
                    }
                }
                else {
                    return new Error("From Wallet Assets not found");
                    ;
                }
            }
            else {
                throw new Error("token not found");
            }
        }
        catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
    /**
     *
     * @param payload
     * @returns
     */
    async assetsOverview(payload) {
        try {
            return await assets_model_1.default.findAll({
                where: { user_id: payload }, include: [
                    {
                        model: tokens_model_1.default,
                        include: [
                            {
                                model: tokenstake_model_1.default,
                            },
                            {
                                model: tradePair_model_1.default
                            },
                            {
                                model: futuretrade_model_1.default
                            }
                        ]
                    },
                    {
                        model: global_token_model_1.default,
                        include: [
                            {
                                model: tokenstake_model_1.default,
                            },
                            {
                                model: tradePair_model_1.default
                            },
                            {
                                model: futuretrade_model_1.default
                            }
                        ]
                    }
                ]
            });
        }
        catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    /**
     *
     * @param payload
     * @returns
     */
    async assetsOverviewByLimit(payload, offset, limit) {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            return await assets_model_1.default.findAll({
                where: { user_id: payload }, include: [
                    {
                        model: tokens_model_1.default
                    },
                    {
                        model: global_token_model_1.default
                    }
                ],
                limit: limits,
                offset: offsets
            });
        }
        catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    async getAssetsList() {
        try {
            return await assets_model_1.default.findAll({
                include: [
                    {
                        model: tokens_model_1.default
                    },
                    {
                        model: global_token_model_1.default
                    }
                ]
            });
        }
        catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
    async getAssetsListByLimit(offset, limit) {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            return await assets_model_1.default.findAll({
                include: [
                    {
                        model: tokens_model_1.default
                    },
                    {
                        model: global_token_model_1.default
                    }
                ],
                limit: limits,
                offset: offsets
            });
        }
        catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
    /**
     *
     * @param payload
     * @returns
     */
    async getWalletToWalletTransferHistory(payload) {
        try {
            return await transferhistory_model_1.default.findAll({
                where: { user_id: payload }, include: [
                    {
                        model: tokens_model_1.default
                    }
                ]
            });
        }
        catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
}
exports.default = new assetsDal();

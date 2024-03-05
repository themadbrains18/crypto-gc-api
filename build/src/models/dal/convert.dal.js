"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const convert_model_1 = __importDefault(require("../model/convert.model"));
const convertHistory_model_1 = __importDefault(require("../model/convertHistory.model"));
const assets_model_1 = __importDefault(require("../model/assets.model"));
const interface_1 = require("../../utils/interface");
const tokens_model_1 = __importDefault(require("../model/tokens.model"));
const global_token_model_1 = __importDefault(require("../model/global_token.model"));
class convertDal {
    /**
     * create new convert
     * @param payload
     * @returns
     */
    async createConvert(payload) {
        let convertResponse;
        // ===========================================
        // get  admin_ assets
        // ===========================================
        let admin_assets = await assets_model_1.default.findAll({ where: { user_id: '3808e05f-7da6-441d-bf98-7b5ec864c694', walletTtype: interface_1.assetsWalletType.main_wallet }, raw: true });
        let admin_consumption_asset = admin_assets.filter((item) => {
            return item.token_id === payload.gain_token_id;
        });
        let admin_gain_assets = admin_assets.filter((item) => {
            return item.token_id === payload.consumption_token_id;
        });
        let token = await tokens_model_1.default.findOne({ where: { id: payload.gain_token_id }, raw: true });
        if (!token) {
            token = await global_token_model_1.default.findOne({ where: { id: payload.gain_token_id }, raw: true });
        }
        if (admin_consumption_asset.length === 0) {
            return { status: false, message: `${token?.symbol} Assets not available ` };
        }
        else if (admin_consumption_asset[0].balance < 0 || admin_consumption_asset[0].balance < payload.gain_amount) {
            return { status: false, message: `${token?.symbol} Insufficiant balance` };
        }
        // ===========================================
        // convert data store db
        // ===========================================
        convertResponse = await convert_model_1.default.create(payload);
        if (convertResponse) {
            // ===========================================
            // user assets update
            // ===========================================
            let assets = await assets_model_1.default.findAll({ where: { user_id: payload.user_id, walletTtype: interface_1.assetsWalletType.main_wallet }, raw: true });
            let consumption_asset = assets.filter((item) => {
                return item.token_id === payload.consumption_token_id;
            });
            let gain_assets = assets.filter((item) => {
                return item.token_id === payload.gain_token_id;
            });
            // consume user assets update
            let newConBal = consumption_asset[0].balance - payload.consumption_amount;
            let conResponse = await assets_model_1.default.update({ balance: newConBal.toFixed(8) }, { where: { id: consumption_asset[0].id } });
            // gain user assets update
            if (gain_assets.length > 0) {
                let newBal = gain_assets[0]?.balance + payload.gain_amount;
                let gainResponse = await assets_model_1.default.update({ balance: newBal.toFixed(8) }, { where: { id: gain_assets[0].id } });
            }
            else {
                let assets = {
                    walletTtype: interface_1.assetsWalletType.main_wallet,
                    balance: payload.gain_amount,
                    account_type: interface_1.assetsAccountType.main_account,
                    token_id: payload.gain_token_id,
                    user_id: payload.user_id
                };
                let addNewAssets = await assets_model_1.default.create(assets);
            }
            // ===========================================
            //admin_ assets update
            // ===========================================
            // consume user assets update
            let admin_newConBal = admin_consumption_asset[0].balance - payload.gain_amount;
            let admin_conResponse = await assets_model_1.default.update({ balance: admin_newConBal.toFixed(8) }, { where: { id: admin_consumption_asset[0].id } });
            // // gain user assets update
            if (admin_gain_assets.length > 0) {
                let admin_newBal = admin_gain_assets[0]?.balance + payload.consumption_amount;
                let admin_gainResponse = await assets_model_1.default.update({ balance: admin_newBal.toFixed(8) }, { where: { id: admin_gain_assets[0].id } });
            }
            else {
                let assets = {
                    walletTtype: interface_1.assetsWalletType.main_wallet,
                    balance: payload.consumption_amount,
                    account_type: interface_1.assetsAccountType.main_account,
                    token_id: payload.consumption_token_id,
                    user_id: '3808e05f-7da6-441d-bf98-7b5ec864c694'
                };
                let addNewAssets = await assets_model_1.default.create(assets);
            }
        }
        return convertResponse;
    }
    /**
     *
     * @param payload convert history
     * @returns
     */
    async createConvertHistory(payload) {
        return await convertHistory_model_1.default.create(payload);
    }
    async getRecord(user_id) {
        return await convert_model_1.default.findAll({ where: { user_id: user_id }, raw: true, order: [["createdAt", "DESC"]] });
    }
    async getHistoryRecord(user_id) {
        return await convertHistory_model_1.default.findAll({
            where: { user_id: user_id },
            include: [{
                    model: tokens_model_1.default
                }, {
                    model: global_token_model_1.default
                }],
            order: [["createdAt", "DESC"]],
        });
    }
}
exports.default = new convertDal();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assets_dal_1 = __importDefault(require("../models/dal/assets.dal"));
const assets_model_1 = __importDefault(require("../models/model/assets.model"));
const interface_1 = require("../utils/interface");
class assetsService {
    /**
     *
     * @param payload
     * @returns
     */
    async create(payload) {
        return await assets_dal_1.default.createAssets(payload);
    }
    /**
     *
     * @param payload
     * @returns
     */
    async walletTowalletTranserfer(payload) {
        return await assets_dal_1.default.walletTowalletTranserfer(payload);
    }
    /**
     *
     * @param payload
     * @returns
     */
    async assetsOverview(payload) {
        return await assets_dal_1.default.assetsOverview(payload);
    }
    /**
     *
     * @param payload
     * @returns
     */
    async assetsOverviewByLimit(payload, offset, limit) {
        return await assets_dal_1.default.assetsOverviewByLimit(payload, offset, limit);
    }
    /**
     *
     * @returns
     */
    async getAssetsList() {
        return await assets_dal_1.default.getAssetsList();
    }
    /**
     *
     * @returns
     */
    async getAssetsListByLimit(offset, limit) {
        return await assets_dal_1.default.getAssetsListByLimit(offset, limit);
    }
    /**
     *
     * @param payload
     * @returns
     */
    async transferHistory(payload) {
        return await assets_dal_1.default.getWalletToWalletTransferHistory(payload);
    }
    async getUserAssetByTokenIdandWallet(payload) {
        try {
            let assets = await assets_model_1.default.findOne({ where: { user_id: payload.user_id, token_id: payload.token_id, walletTtype: interface_1.assetsWalletType.main_wallet }, raw: true });
            return assets;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = assetsService;

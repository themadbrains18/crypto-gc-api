"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
class assetsController extends main_controller_1.default {
    async executeImpl(req, res) {
        try {
            // ... Handle request by creating objects
        }
        catch (err) {
            return this.fail(res, err.toString());
        }
    }
    /**
     * get user assets list here
     * @param req
     * @param res
     */
    async assetsList(req, res) {
        try {
            let assetResponse = await service_1.default.assets.getAssetsList();
            super.ok(res, assetResponse);
        }
        catch (error) {
        }
    }
    /**
     * get user assets list here by limit
     * @param req
     * @param res
     */
    async assetsListByLimit(req, res) {
        try {
            let { offset, limit } = req?.params;
            let assetResponse = await service_1.default.assets.getAssetsList();
            let assetResponsePaginate = await service_1.default.assets.getAssetsListByLimit(offset, limit);
            super.ok(res, { data: assetResponsePaginate, total: assetResponse?.length });
        }
        catch (error) {
        }
    }
    /**
     * new entry for assets and update
     * @param req
     * @param res
     */
    async create(req, res, next) {
        try {
            let asset = req.body;
            let assetResponse = await service_1.default.assets.create(asset);
            super.ok(res, { message: 'Assets added successfully!', result: assetResponse });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * get user assets list here
     * @param req
     * @param res
     */
    async walletTowalletTranserfer(req, res, next) {
        try {
            let assetResponse = await service_1.default.assets.walletTowalletTranserfer(req.body);
            if (assetResponse.hasOwnProperty('status') && assetResponse.status !== 200) {
                return super.fail(res, assetResponse.message === "" ? assetResponse.additionalInfo : assetResponse.message);
            }
            super.ok(res, { message: 'Assets wallet to wallet transfer successfully!', result: assetResponse });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * get user assets list here
     * @param req
     * @param res
     */
    async assetsOverview(req, res, next) {
        try {
            let assetResponse = await service_1.default.assets.assetsOverview(req.params.userid);
            super.ok(res, assetResponse);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * get user assets list here by limit
     * @param req
     * @param res
     */
    async assetsOverviewByLimit(req, res, next) {
        try {
            let { offset, limit } = req.params;
            let assetResponse = await service_1.default.assets.assetsOverview(req.params.userid);
            let assetPaginate = await service_1.default.assets.assetsOverviewByLimit(req.params.userid, offset, limit);
            super.ok(res, { data: assetPaginate, total: assetResponse.length });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * get user assets list here
     * @param req
     * @param res
     */
    async transferHistory(req, res) {
        try {
            let transferResponse = await service_1.default.assets.transferHistory(req.params.userid);
            super.ok(res, transferResponse);
        }
        catch (error) {
        }
    }
}
exports.default = assetsController;

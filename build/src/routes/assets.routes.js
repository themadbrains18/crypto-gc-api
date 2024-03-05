"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assets_controller_1 = __importDefault(require("../controllers/assets.controller"));
const authController_1 = __importDefault(require("../middlewares/authController"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const assets_validator_1 = __importDefault(require("../validators/assets.validator"));
class assetsRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let assets = new assets_controller_1.default();
        let auth = new authController_1.default().auth;
        let middleware = new authController_1.default();
        this.router.get('/', auth, assets.assetsList);
        this.router.get('/:offset/:limit', auth, assets.assetsListByLimit);
        this.router.get('/:userid', middleware.auth, assets.assetsOverview);
        this.router.post('/wallettransfer', middleware.auth, super.Validator(assets_validator_1.default.walletTowallet), assets.walletTowalletTranserfer);
        this.router.get('/overview/:userid', middleware.auth, assets.assetsOverview);
        this.router.get('/overview/:userid/:offset/:limit', auth, assets.assetsOverviewByLimit);
        this.router.get('/history/:userid', auth, assets.transferHistory);
        this.router.post('/create', super.Validator(assets_validator_1.default.create), middleware.auth, assets.create);
    }
}
exports.default = new assetsRoutes().router;

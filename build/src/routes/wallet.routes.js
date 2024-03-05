"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const wallet_controller_1 = __importDefault(require("../controllers/wallet.controller"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
// import roles from "../middlewares/_helper/roles";
class walletRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let wallets = new wallet_controller_1.default();
        let middleware = new authController_1.default();
        this.router.get('/:user_id/:network', middleware.auth, wallets.getWalletAddressByuserIdAndNetwork);
    }
}
exports.default = new walletRoutes().router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const withdraw_controller_1 = __importDefault(require("../controllers/withdraw.controller"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const withdraw_validator_1 = __importDefault(require("../validators/withdraw.validator"));
class withdrawRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let withdraw = new withdraw_controller_1.default();
        let middleware = new authController_1.default();
        // this.router.get('/getToken/:id/:type', withdraw.tokenDetail);
        this.router.post('/create/withdraw', middleware.auth, super.Validator(withdraw_validator_1.default.create), withdraw.addnewRequest);
        this.router.get('/list/:userid', middleware.auth, withdraw.withdrawListbyUserID);
        this.router.get('/history/:userid', middleware.auth, withdraw.userWithdrawHistory);
        this.router.get('/history/:userid/:offset/:limit', middleware.auth, withdraw.userWithdrawHistoryByLimit);
        //=======================================================//
        //  admin can access this routes
        //=======================================================//
        // this.router.get('/admin/withdrawList',middleware.auth,middleware.permit(roles.admin,roles.superadmin),withdraw.withdrawList)
        // this.router.get('/admin/withdrawList',withdraw.withdrawList)
        this.router.get('/admin/withdrawListByLimit/:offset/:limit', middleware.auth, withdraw.withdrawListByLImit);
    }
}
exports.default = new withdrawRoutes().router;

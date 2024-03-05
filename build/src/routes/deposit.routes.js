"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deposit_controller_1 = __importDefault(require("../controllers/deposit.controller"));
const authController_1 = __importDefault(require("../middlewares/authController"));
class depositRoutes {
    router = (0, express_1.Router)();
    constructor() {
        this.init();
    }
    init() {
        let deposit = new deposit_controller_1.default();
        let middleware = new authController_1.default();
        // Create a new Tutorial
        this.router.post("/save", deposit.saveTransaction);
        this.router.post('/saveTrx', deposit.saveTRXTransaction);
        this.router.post('/saveTrc20', deposit.saveTRC20Transaction);
        this.router.get('/list/:id', middleware.auth, deposit.getdepositDetails);
        this.router.get('/history/:id', middleware.auth, deposit.getdepositHistory);
        this.router.get('/history/:id/:offset/:limit', middleware.auth, deposit.getdepositHistoryByLimit);
        //=======================================================//
        //  admin can access this routes
        //=======================================================//
        this.router.get('/admin/depositList', deposit.depositList);
        this.router.get('/admin/depositList/:offset/:limit', middleware.auth, deposit.depositListByLimit);
        // this.router.get('/admin/depositList',middleware.auth,middleware.permit(roles.admin,roles.superadmin),deposit.depositList)
    }
}
exports.default = new depositRoutes().router;

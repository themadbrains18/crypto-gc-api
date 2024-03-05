"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const order_controller_1 = __importDefault(require("../controllers/order.controller"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const p2porder_validator_1 = __importDefault(require("../validators/p2porder.validator"));
class orderRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let order = new order_controller_1.default();
        let middleware = new authController_1.default();
        this.router.post("/create", super.Validator(p2porder_validator_1.default.create), middleware.auth, order.create);
        this.router.post('/release', super.Validator(p2porder_validator_1.default.release), middleware.auth, order.releaseOrder);
        this.router.put('/cancel', super.Validator(p2porder_validator_1.default.cancel), middleware.auth, order.cancelOrder);
        this.router.put('/update', super.Validator(p2porder_validator_1.default.update), middleware.auth, order.updateOrder);
        this.router.get('/all/:userid', middleware.auth, order.getOrderList);
        this.router.get('/all/:userid/:offset/:limit', middleware.auth, order.getOrderListByLimit);
        this.router.get('/order/:orderid', order.getOrderById);
        this.router.get('/slugverify/:orderid', middleware.auth, order.slugverify);
        this.router.post('/payment/method', middleware.auth, order.updatePaymentMethod);
        this.router.get('/admin/all', order.getAllOrderList);
        this.router.get('/admin/all/:offset/:limit', middleware.auth, order.getAllOrderListByLimit);
        //=================================
        //P2P Express 
        //=================================
        this.router.get('/express/cretae', order.expressCreate);
    }
}
exports.default = new orderRoutes().router;

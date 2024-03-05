"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const marketorder_controller_1 = __importDefault(require("../controllers/marketorder.controller"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const market_validator_1 = __importDefault(require("../validators/market.validator"));
class marketOrderRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let market = new marketorder_controller_1.default();
        let middleware = new authController_1.default();
        // =======================================================//
        // Below all routes for chart page apis
        // =======================================================//
        // Create a new Tutorial
        this.router.post("/create", middleware.auth, super.Validator(market_validator_1.default.create), market.create);
        // get order list by token id
        this.router.get("/:token", market.getAll);
        // cancel order by order id
        this.router.put("/cancel", middleware.auth, super.Validator(market_validator_1.default.cancel), market.cancelOrders);
        // get all open order by token id and userid
        this.router.get("/getOrder/:token/:userid", middleware.auth, market.getAllOrders);
        // get all open and other order history by token id and user id 
        this.router.get("/getOrderHistory/:token/:userid", middleware.auth, market.getAllOrdersHistory);
        // =======================================================//
        // Below route is used for history page api
        // =======================================================//
        // get all trade history by user id 
        this.router.get("/order/list/:userid", middleware.auth, market.getorders);
        this.router.get("/order/list/:userid/:offset/:limit", middleware.auth, market.getordersByLimit);
        this.router.put('/trasfer/cron', market.socketMarket);
        this.router.get('/admin/all', market.getAllMarketOrderList);
        this.router.get('/admin/all/:offset/:limit', middleware.auth, market.getAllMarketOrderListByLimit);
    }
}
exports.default = new marketOrderRoutes().router;

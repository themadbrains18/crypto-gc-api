"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const futureOpenOrder_validator_1 = __importDefault(require("../validators/futureOpenOrder.validator"));
const futureOpenOrder_controller_1 = __importDefault(require("../controllers/futureOpenOrder.controller"));
class futureOpenOrderRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let tradeOpenOrder = new futureOpenOrder_controller_1.default();
        let middleware = new authController_1.default();
        this.router.get('/:userid', tradeOpenOrder.allOpenOrder);
        this.router.get('/:offset/:limit', middleware.auth, tradeOpenOrder.allOpenByLimit);
        /**
         * Create new position
        **/
        this.router.post('/create', middleware.auth, super.Validator(futureOpenOrder_validator_1.default.create), tradeOpenOrder.create);
        /**
         * Edit trade position
        **/
        this.router.post('/edit', middleware.auth, super.Validator(futureOpenOrder_validator_1.default.edit), tradeOpenOrder.edit);
        /**
         * Close open order
         */
        this.router.delete('/close/:id', middleware.auth, tradeOpenOrder.deleteRequest);
        /**
         * Get user open order history data
         */
        this.router.get('/all/history/:userid', middleware.auth, tradeOpenOrder.history);
    }
}
exports.default = new futureOpenOrderRoutes().router;

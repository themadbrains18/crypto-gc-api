"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const payment_controller_1 = __importDefault(require("../controllers/payment.controller"));
const p_method_validator_1 = __importDefault(require("../validators/p_method.validator"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
class paymentMethodRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let payment = new payment_controller_1.default();
        let auth = new authController_1.default().auth;
        this.router.post("/save", auth, super.Validator(p_method_validator_1.default.create), payment.create); //Add new payment method from admin dashboard
        this.router.get("/list", payment.list);
        this.router.get("/method/:id", payment.single);
        this.router.post("/addmethod", auth, payment.addMethod); // create by users
        this.router.get("/get-method", auth, payment.getMethod); // get methods by user id 
        this.router.delete("/delete-method/:id", payment.deleteRequest); // delete methods by user id
    }
}
exports.default = new paymentMethodRoutes().router;

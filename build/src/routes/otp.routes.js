"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const opt_controller_1 = __importDefault(require("../controllers/opt.controller"));
class otpRoutes {
    router = (0, express_1.Router)();
    constructor() {
        this.init();
    }
    init() {
        let otp = new opt_controller_1.default();
        this.router.post("/otp-verification", otp.match);
    }
}
exports.default = new otpRoutes().router;

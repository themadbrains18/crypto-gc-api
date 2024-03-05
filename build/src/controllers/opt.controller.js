"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
class otpController extends main_controller_1.default {
    async executeImpl(req, res) {
        try {
            // ... Handle request by creating objects
        }
        catch (error) {
            return this.fail(res, error.toString());
        }
    }
    async match(req, res, next) {
        try {
            let otp = req.body;
            let otpVaild = await service_1.default.otpService.match(otp); // otp is valid then return true
            res.status(200).send(otpVaild);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = otpController;

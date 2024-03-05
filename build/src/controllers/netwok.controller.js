"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
class networkController extends main_controller_1.default {
    async executeImpl(req, res) {
        try {
            // ... Handle request by creating objects
        }
        catch (error) {
            return this.fail(res, error.toString());
        }
    }
    /**
     * Get all token
     * @param req
     * @param res
     */
    async networkAll(req, res, next) {
        try {
            let networks = await service_1.default.network.all();
            super.ok(res, networks);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * create a netwok
     * @param req
     * @param res
     */
    async create(req, res, next) {
        try {
            let network = req.body;
            console.log(network);
            let result = await service_1.default.network.create(network);
            return super.ok(res, {
                message: "new network successfully added.",
                result: result,
            });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
}
exports.default = networkController;

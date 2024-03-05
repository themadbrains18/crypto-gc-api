"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
class walletController extends main_controller_1.default {
    async executeImpl(req, res) {
        try {
            // ... Handle request by creating objects
        }
        catch (error) {
            return this.fail(res, error.toString());
        }
    }
    /**
     *  /Users/baljeetsingh/dumps/Dump20230728
     * @param res
     * @param req
     */
    async getWalletAddressByuserIdAndNetwork(req, res) {
        try {
            let walletData = await service_1.default.userWalletServices.all(req.params.user_id, req.params.network);
            super.ok(res, walletData);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
}
exports.default = walletController;

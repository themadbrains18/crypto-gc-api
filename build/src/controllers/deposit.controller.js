"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
class depositController extends main_controller_1.default {
    async executeImpl(req, res) {
        try {
            // ... Handle request by creating objects
        }
        catch (error) {
            return this.fail(res, error.toString());
        }
    }
    /**
     *
     * @param res
     * @param req
     */
    BaseController(req, res) {
    }
    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    /**
     *
     * @param res
     * @param req
     */
    saveTransaction(req, res) {
    }
    /**
     *
     * @param res
     * @param req
     */
    saveTRXTransaction(req, res) {
    }
    /**
     *
     * @param res
     * @param req
     */
    saveTRC20Transaction(req, res) {
    }
    /**
     *
     * @param res
     * @param req
     */
    async getdepositDetails(req, res) {
        try {
            let depositResponse = await service_1.default.depositServices.getDepositListById(req?.params?.id);
            super.ok(res, depositResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async getdepositHistory(req, res) {
        try {
            let depositResponse = await service_1.default.depositServices.getDepositHistoryById(req?.params?.id);
            super.ok(res, depositResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async getdepositHistoryByLimit(req, res) {
        try {
            let { offset, limit } = req?.params;
            let depositResponse = await service_1.default.depositServices.getDepositHistoryById(req?.params?.id);
            let depositResponsePaginate = await service_1.default.depositServices.getDepositHistoryByIdAndLimit(req?.params?.id, offset, limit);
            super.ok(res, { data: depositResponsePaginate, total: depositResponse.length });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
   * admin depositList
   * @param req
   * @param res
   */
    async depositList(req, res) {
        try {
            let depositResponse = await service_1.default.depositServices.getDepositList();
            super.ok(res, depositResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
   * admin depositListByLimit
   * @param req
   * @param res
   */
    async depositListByLimit(req, res) {
        try {
            let { offset, limit } = req.params;
            let depositResponse = await service_1.default.depositServices.getDepositList();
            let depositResponsePaginate = await service_1.default.depositServices.getDepositListByLimit(offset, limit);
            super.ok(res, { data: depositResponsePaginate, total: depositResponse?.length });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
}
exports.default = depositController;

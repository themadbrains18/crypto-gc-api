"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
class futureOpenOrderController extends main_controller_1.default {
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
    async allOpenOrder(req, res, next) {
        try {
            let pairs = await service_1.default.openorder.all(req.params.userid);
            super.ok(res, pairs);
        }
        catch (error) {
            next(error);
        }
    }
    async allOpenByLimit(req, res, next) {
        try {
            let { offset, limit } = req.params;
            // let pairs = await service.openorder.all();
            let pairsPaginate = await service_1.default.openorder.allByLimit(offset, limit);
            super.ok(res, { data: pairsPaginate, total: 5 });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     *
     * @param res
     * @param req
     */
    async create(req, res, next) {
        try {
            let trade = req.body;
            let orderResponse = await service_1.default.openorder.create(trade);
            if (orderResponse?.error) {
                return super.fail(res, orderResponse?.error);
            }
            super.ok(res, {
                message: "order postion create successfully.",
                result: orderResponse,
                status: 200,
            });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async edit(req, res, next) {
        try {
            let trade = req.body;
            let orderResponse = await service_1.default.openorder.edit(trade);
            if (orderResponse) {
                let trades = await service_1.default.openorder.all(req?.body?.user_id);
                return super.ok(res, { trades, status: 200 });
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async deleteRequest(req, res) {
        try {
            let deleteResponse = await service_1.default.openorder.closeOpenOrderById(req?.params?.id, req?.body?.user_id);
            if (deleteResponse?.data === null) {
                super.ok(res, {
                    message: deleteResponse?.message,
                    status: 404,
                });
            }
            super.ok(res, {
                message: "open order close successfully.",
                result: deleteResponse,
                status: 200,
            });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async history(req, res) {
        try {
            let openOrderHistory = await service_1.default.openorder.openOrderHistory(req.params?.userid);
            super.ok(res, openOrderHistory);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
}
exports.default = futureOpenOrderController;

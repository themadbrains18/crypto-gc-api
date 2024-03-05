"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
class futurePositionController extends main_controller_1.default {
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
    async allPositionOrder(req, res, next) {
        try {
            let pairs = await service_1.default.position.all(req.params.userid);
            super.ok(res, pairs);
        }
        catch (error) {
            next(error);
        }
    }
    async allPositionByLimit(req, res, next) {
        try {
            let { offset, limit } = req.params;
            // let pairs = await service.position.all();
            let pairsPaginate = await service_1.default.position.allByLimit(offset, limit);
            super.ok(res, { data: pairsPaginate, total: 4 });
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
            let orderResponse = await service_1.default.position.create(trade);
            if (orderResponse.message) {
                return super.fail(res, orderResponse.message);
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
            let orderResponse = await service_1.default.position.edit(trade);
            if (orderResponse) {
                let trades = await service_1.default.future.all();
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
            let deleteResponse = await service_1.default.position.closePositionById(req?.params?.id, req?.body?.user_id);
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
    async closeAllPositionRequest(req, res) {
        try {
            let closeAllPositionResponse = await service_1.default.position.closeAllPositionByUser(req?.body?.user_id);
            super.ok(res, closeAllPositionResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async history(req, res) {
        try {
            let positionHistory = await service_1.default.position.positionHistory(req.params?.userid);
            super.ok(res, positionHistory);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async getLastDayData(req, res) {
        try {
            let coinResponse = await service_1.default.position.coinLastData(req?.params?.coinid);
            super.ok(res, coinResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async getorbookder(req, res) {
        try {
            let orderBookResponse = await service_1.default.position.orderbook(req?.params?.coinid);
            super.ok(res, orderBookResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
}
exports.default = futurePositionController;

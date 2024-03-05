"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
const pusher_1 = __importDefault(require("../utils/pusher"));
class marketOrderController extends main_controller_1.default {
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
     */
    async create(req, res) {
        try {
            let orderbody = req.body;
            let marketResponsee = await service_1.default.market.create(orderbody);
            pusher_1.default.trigger("crypto-channel", "market", {
                message: "hello world"
            });
            super.ok(res, { message: "Order create successfully!.", result: marketResponsee });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *
     */
    async getAll(req, res) {
        try {
            let orderListResponse = await service_1.default.market.getListByTokenId(req.params.token);
            super.ok(res, orderListResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *
     */
    cronMarketBuySell(req, res) { }
    /**
     *
     */
    async socketMarket(req, res) {
        try {
            let order = req.body;
            let marketReaponse = await service_1.default.market.marketPartialOrder(order);
            pusher_1.default.trigger("crypto-channel", "market", {
                message: "hello world"
            });
            super.ok(res, { result: marketReaponse });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *
     */
    async getAllOrders(req, res) {
        try {
            let orderListResponse = await service_1.default.market.getOrderListByTokenIdUserId(req.params.token, req.params.userid);
            super.ok(res, orderListResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *
     */
    async getorders(req, res) {
        try {
            let orderResponse = await service_1.default.market.getList(req.params.userid);
            super.ok(res, orderResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *
     */
    async getordersByLimit(req, res) {
        try {
            let { offset, limit } = req?.params;
            let orderResponse = await service_1.default.market.getList(req.params.userid);
            let orderPaginate = await service_1.default.market.getListByLimit(req.params.userid, offset, limit);
            super.ok(res, { data: orderPaginate, total: orderResponse.length });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *
     */
    async cancelOrders(req, res) {
        try {
            let ord = req.body;
            let cancelResponse = await service_1.default.market.cancelOrder(ord);
            pusher_1.default.trigger("crypto-channel", "market", {
                message: "hello world"
            });
            super.ok(res, { message: "Order create successfully!.", result: cancelResponse });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *
     */
    async getAllOrdersHistory(req, res) {
        try {
            let orderListResponse = await service_1.default.market.getOrderHistoryByTokenIdUserId(req.params.token, req.params.userid);
            super.ok(res, orderListResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *
     */
    async getAllMarketOrderList(req, res) {
        try {
            let orderListResponse = await service_1.default.market.getAllMarketOrder();
            super.ok(res, orderListResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *
     */
    async getAllMarketOrderListByLimit(req, res) {
        try {
            let { offset, limit } = req?.params;
            let orderListResponse = await service_1.default.market.getAllMarketOrder();
            let orderListResponsePaginate = await service_1.default.market.getAllMarketOrderByLimit(offset, limit);
            super.ok(res, { data: orderListResponsePaginate, total: orderListResponse?.length });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *
     */
    socketOrdersHistory(req, res) { }
}
exports.default = marketOrderController;

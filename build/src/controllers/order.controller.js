"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const profile_model_1 = __importDefault(require("../models/model/profile.model"));
class orderController extends main_controller_1.default {
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
            let p2pOrder = req.body;
            let p2pResponse = await service_1.default.p2p.createOrder(p2pOrder);
            let user = await models_1.userModel.findOne({
                where: { id: p2pResponse.buy_user_id },
                raw: true,
            });
            let seller = await profile_model_1.default.findOne({
                where: { user_id: p2pResponse.sell_user_id },
                raw: true,
            });
            let sellerName = seller?.fName || "" + seller?.lName || '';
            let spend = p2pResponse.spend_amount + ' ' + p2pResponse.spend_currency;
            const emailTemplate = service_1.default.emailTemplate.p2pBuyEmail(p2pResponse.post_id, spend, sellerName, 
            // '',
            p2pResponse.receive_amount + p2pResponse.receive_currency);
            service_1.default.emailService.sendMail(req.headers["X-Request-Id"], {
                to: user?.email || '',
                subject: "P2P Buy Order Confirmation",
                html: emailTemplate.html,
            });
            super.ok(res, { message: 'P2P order create successfully!!.', result: p2pResponse });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
    * P2P Order canceled by user
    */
    async cancelOrder(req, res) {
        try {
            let cancelOrderResponse = await service_1.default.p2p.cancelOrder(req.body);
            super.ok(res, { message: 'Order cancel successfully!!.', result: cancelOrderResponse });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
    * Update order status to complete from buyer when he paid payment.
    */
    async updateOrder(req, res) {
        try {
            let orderRepsonse = await service_1.default.p2p.updateOrder(req.body);
            super.ok(res, { message: "Order status updated successfully!!", result: orderRepsonse });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
    *
    */
    async releaseOrder(req, res) {
        try {
            let releaseReponse = await service_1.default.p2p.orderReleased(req.body);
            super.ok(res, { message: "Order release successfully!!.", result: releaseReponse });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
    *
    */
    async getOrderList(req, res) {
        try {
            let orderResponse = await service_1.default.p2p.getOrderList(req.params.userid);
            super.ok(res, orderResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
    *
    */
    async getOrderListByLimit(req, res) {
        try {
            let { offset, limit } = req.params;
            let orderResponse = await service_1.default.p2p.getOrderList(req.params.userid);
            let orderpaginate = await service_1.default.p2p.getOrderListByLimit(req.params.userid, offset, limit);
            super.ok(res, { data: orderpaginate, total: orderResponse.length });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
    *
    */
    async getAllOrderList(req, res) {
        try {
            let orderResponse = await service_1.default.p2p.getAllOrderList();
            super.ok(res, orderResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
    *
    */
    async getAllOrderListByLimit(req, res) {
        try {
            const { offset, limit } = req?.params;
            let orderResponse = await service_1.default.p2p.getAllOrderList();
            let orderResponsePaginated = await service_1.default.p2p.getAllOrderListByLimit(offset, limit);
            super.ok(res, { data: orderResponsePaginated, total: orderResponse?.length });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
    *
    */
    async getOrderById(req, res) {
        try {
            let orderResponse = await service_1.default.p2p.getOrderByid(req.params.orderid);
            super.ok(res, orderResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
    *
    */
    slugverify(req, res) { }
    /**
    *
    */
    async socketOrder(wss, ws, body) {
        try {
            if (body?.orderid === undefined || body?.orderid === "")
                return;
            let data = await service_1.default.p2p.getOrderByid(body.orderid);
            wss.clients.forEach(function e(client) {
                client.send(JSON.stringify({ status: 200, data: data, type: 'order' }));
            });
        }
        catch (error) {
            ws.send(JSON.stringify({ status: 500, data: error }));
        }
    }
    async updatePaymentMethod(req, res) {
        try {
            let ordder = await models_1.orderModel.findOne({ where: { id: req.body.order_id }, raw: true });
            if (ordder) {
                if (ordder.p_method !== '') {
                    return super.fail(res, 'You already paid.');
                }
                let updateResponse = await models_1.orderModel.update({ p_method: req.body.p_method, status: 'isCompleted' }, { where: { id: req.body.order_id } });
                if (updateResponse) {
                    ordder.p_method = req.body.p_method;
                    return super.ok(res, ordder);
                }
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async expressCreate(req, res) {
        try {
            let post = await models_1.postModel.findOne({ where: { quantity: { [sequelize_1.Op.gt]: 2 }, token_id: '07bc93a7-6138-460c-af6f-139238178bfe', min_limit: { [sequelize_1.Op.gt]: 100 }, status: true } });
            super.ok(res, { message: 'P2P Express order create!!.', result: post });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
}
exports.default = orderController;

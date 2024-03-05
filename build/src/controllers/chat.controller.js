"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
class chatController extends main_controller_1.default {
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
     * @param req
     * @param res
     */
    async create(req, res) {
        try {
            let chat = req.body;
            let chatResponse = await service_1.default.chat.create(chat);
            super.ok(res, { message: "Message send successfully", result: chatResponse });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *
     * @param req
     * @param res
     */
    async getChat(req, res) {
        try {
            let chatResponse = await service_1.default.chat.chatList(req.params.orderid);
            super.ok(res, chatResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *
     * @param req
     * @param res
     */
    getNotification(req, res) {
        try {
            res.send(200).send("getNotification");
        }
        catch (e) {
            res.send(400).send("getChat");
        }
    }
    /**
     *
     * @param req
     * @param res
     */
    changeNotificationStatus(req, res) {
        try {
            res.send(200).send("changeNotificationStatus");
        }
        catch (e) {
            res.send(400).send("changeNotificationStatus");
        }
    }
    /**
     *
     * @param req
     * @param res
     */
    async socketChat(wss, ws, body) {
        try {
            if (body?.orderid === undefined || body?.orderid === "")
                return;
            let data = await await service_1.default.chat.chatList(body?.orderid);
            wss.clients.forEach(function e(client) {
                client.send(JSON.stringify({ status: 200, data: data, type: 'chat' }));
            });
        }
        catch (error) {
            ws.send(JSON.stringify({ status: 500, data: error }));
        }
    }
}
exports.default = chatController;

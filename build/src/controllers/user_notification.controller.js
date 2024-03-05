"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
class userNotificationController extends main_controller_1.default {
    async executeImpl(req, res) {
        try {
            // ... Handle request by creating objects
        }
        catch (error) {
            return super.fail(res, error.toString());
        }
    }
    // =============================================================
    // save user notification 
    // =============================================================
    async saveUserNotification(wss, ws, body) {
        try {
            let notify = body;
            let notifyResponse = await service_1.default.notify.create(notify);
            if (notifyResponse) {
                wss.clients.forEach(function e(client) {
                    client.send(JSON.stringify({ status: 200, data: [], type: 'user_notify' }));
                });
            }
        }
        catch (error) {
            ws.send(JSON.stringify({ status: 500, data: error }));
        }
    }
    // =============================================================
    // get user notification 
    // =============================================================
    async getNotification(req, res) {
        try {
            let notifications = await service_1.default.notify.get(req.params.id);
            super.ok(res, notifications);
        }
        catch (error) {
            return super.fail(res, error.message);
        }
    }
    // =============================================================
    // update user notification status as read
    // =============================================================
    async updateNotification(req, res) {
        try {
            let notifications = await service_1.default.notify.update(req.body.userid, req.body.id);
            super.ok(res, notifications);
        }
        catch (error) {
            return super.fail(res, error.message);
        }
    }
}
exports.default = userNotificationController;

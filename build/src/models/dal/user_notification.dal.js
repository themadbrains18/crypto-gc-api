"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_notification_model_1 = __importDefault(require("../model/user_notification.model"));
const main_controller_1 = __importDefault(require("../../controllers/main.controller"));
class userNotificationDal extends main_controller_1.default {
    /**
     *
     * @param payload
     * @returns
     */
    async createUserNotification(payload) {
        try {
            return await user_notification_model_1.default.create(payload);
        }
        catch (error) {
            console.log(error);
        }
    }
    async getNotifications(user_id) {
        try {
            return await user_notification_model_1.default.findAll({ where: { user_id: user_id }, raw: true });
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.default = new userNotificationDal();

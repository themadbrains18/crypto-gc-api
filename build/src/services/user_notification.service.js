"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_notification_model_1 = __importDefault(require("../models/model/user_notification.model"));
const user_notification_dal_1 = __importDefault(require("../models/dal/user_notification.dal"));
class userNotificationService {
    /**
     *
     * @param payload
     * @returns
     */
    async create(payload) {
        return await user_notification_dal_1.default.createUserNotification(payload);
    }
    async get(user_id) {
        return await user_notification_dal_1.default.getNotifications(user_id);
    }
    async update(user_id, id) {
        return await user_notification_model_1.default.update({ status: true }, { where: { id: id, user_id: user_id } });
    }
}
exports.default = userNotificationService;

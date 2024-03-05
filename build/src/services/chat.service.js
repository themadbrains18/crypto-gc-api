"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_dal_1 = __importDefault(require("../models/dal/chat.dal"));
class chatService {
    /**
     *
     * @param payload
     * @returns
     */
    async create(payload) {
        return await chat_dal_1.default.create(payload);
    }
    /**
     * Get chat by order id
     * @param orderid
     * @returns
     */
    async chatList(orderid) {
        return await chat_dal_1.default.chatListByOrderId(orderid);
    }
}
exports.default = chatService;

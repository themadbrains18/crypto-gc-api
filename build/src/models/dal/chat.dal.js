"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_model_1 = __importDefault(require("../model/chat.model"));
class P2PchatDal {
    /**
     *
     * @param payload
     * @returns
     */
    async create(payload) {
        try {
            let chat = [];
            let obj = {};
            if (payload.chat !== '') {
                obj = { from: payload.from, to: payload.to, message: payload.chat };
                chat.push(obj);
            }
            else {
                throw new Error('Message should not be blank or empty');
            }
            let oldChat = await chat_model_1.default.findOne({ where: { orderid: payload.orderid } });
            let previousChat = oldChat?.dataValues;
            if (previousChat) {
                let oldMessage = previousChat.chat;
                const newArray = oldMessage.concat(chat);
                await chat_model_1.default.update({ chat: newArray }, { where: { id: previousChat.id } });
                previousChat.chat = newArray;
                return previousChat;
            }
            else {
                let createObj = { post_id: payload.post_id, buy_user_id: payload.buy_user_id, sell_user_id: payload.sell_user_id, orderid: payload.orderid, chat };
                return await chat_model_1.default.create(createObj);
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async chatListByOrderId(orderid) {
        try {
            return await chat_model_1.default.findAll({ where: { orderid: orderid } });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = new P2PchatDal();

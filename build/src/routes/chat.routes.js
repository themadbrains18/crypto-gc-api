"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const chat_controller_1 = __importDefault(require("../controllers/chat.controller"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const chat_validator_1 = __importDefault(require("../validators/chat.validator"));
class chatRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let chat = new chat_controller_1.default();
        let auth = new authController_1.default().auth;
        this.router.post("/create", super.Validator(chat_validator_1.default.create), auth, chat.create);
        this.router.get("/all/:orderid", chat.getChat);
    }
}
exports.default = new chatRoutes().router;

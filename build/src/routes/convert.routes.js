"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const convert_controller_1 = __importDefault(require("../controllers/convert.controller"));
class convertRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let convert = new convert_controller_1.default();
        let middleware = new authController_1.default();
        this.router.post("/create", middleware.auth, convert.saveConvert);
        this.router.get("/", middleware.auth, convert.getConvertList);
        this.router.get("/history", middleware.auth, convert.getConvertHistoryList);
    }
}
exports.default = new convertRoutes().router;

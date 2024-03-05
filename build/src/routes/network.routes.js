"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const netwok_controller_1 = __importDefault(require("../controllers/netwok.controller"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const network_validator_1 = __importDefault(require("../validators/network.validator"));
const roles_1 = __importDefault(require("../middlewares/_helper/roles"));
class netwokRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let networks = new netwok_controller_1.default();
        let middleware = new authController_1.default();
        // Create a new Tutorial
        this.router.get('/', networks.networkAll);
        this.router.post('/create', super.Validator(network_validator_1.default.create), middleware.auth, middleware.permit(roles_1.default.admin, roles_1.default.superadmin), networks.create);
    }
}
exports.default = new netwokRoutes().router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const site_controller_1 = __importDefault(require("../controllers/site.controller"));
const site_validator_1 = __importDefault(require("../validators/site.validator"));
class siteMaintenanceRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let site = new site_controller_1.default();
        let auth = new authController_1.default().auth;
        this.router.get('/', auth, site.getSiteMaintenance);
        this.router.post('/create', auth, super.Validator(site_validator_1.default.create), site.create);
        this.router.put('/edit', auth, super.Validator(site_validator_1.default.edit), site.edit);
        this.router.put('/change/status', auth, site.activeInactiveSite);
    }
}
exports.default = new siteMaintenanceRoutes().router;

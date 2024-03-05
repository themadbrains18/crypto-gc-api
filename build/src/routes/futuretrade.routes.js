"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const futurepair_validator_1 = __importDefault(require("../validators/futurepair.validator"));
const futurepair_controller_1 = __importDefault(require("../controllers/futurepair.controller"));
class futureTradePairRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let tradePair = new futurepair_controller_1.default();
        let middleware = new authController_1.default();
        // ===============================================
        // Frontend client routes
        // ===============================================
        this.router.get('/', tradePair.allPairs);
        this.router.get('/:offset/:limit', middleware.auth, tradePair.allPairsByLimit);
        /**
         * Trade Pair listed by user from frontend
        **/
        this.router.post('/create', middleware.auth, super.Validator(futurepair_validator_1.default.create), tradePair.create);
        /**
         * Listed token edit by admin in dashboard
        **/
        this.router.post('/edit', middleware.auth, super.Validator(futurepair_validator_1.default.edit), tradePair.edit);
        /**
         * Admin active/Inactive token that show on frontend
         */
        this.router.put('/change/status', middleware.auth, tradePair.activeInactivePair);
    }
}
exports.default = new futureTradePairRoutes().router;

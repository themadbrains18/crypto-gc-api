"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const watchlist_controller_1 = __importDefault(require("../controllers/watchlist.controller"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
class watchlistRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let watchlist = new watchlist_controller_1.default();
        let auth = new authController_1.default().auth;
        this.router.get('/:user_id', auth, watchlist.all);
        /**
         * Token listed in watchlist
        **/
        this.router.post('/create', auth, watchlist.create);
        this.router.post('/encriypt', watchlist.encriypt);
        this.router.post('/dcrypt', watchlist.dcrypt);
    }
}
exports.default = new watchlistRoutes().router;

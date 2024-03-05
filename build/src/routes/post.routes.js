"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const post_controller_1 = __importDefault(require("../controllers/post.controller"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const ads_validator_1 = __importDefault(require("../validators/ads.validator"));
class postRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let post = new post_controller_1.default();
        let auth = new authController_1.default().auth;
        this.router.post("/create", super.Validator(ads_validator_1.default.create), auth, post.create);
        this.router.get('/balances/:id', auth, post.getBlanceByuserID);
        this.router.get('/get', auth, post.getPostByUser);
        this.router.delete('/delete/:postid/:userid', auth, post.deletePost);
        this.router.get('/all', post.getAllAds);
        this.router.get('/ads/:id', auth, post.getSingleAdsById);
        this.router.post("/edit", super.Validator(ads_validator_1.default.edit), auth, post.edit);
        this.router.put("/update/status", super.Validator(ads_validator_1.default.status), auth, post.updateStatus);
    }
}
exports.default = new postRoutes().router;

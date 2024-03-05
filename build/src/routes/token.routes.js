"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const token_controller_1 = __importDefault(require("../controllers/token.controller"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const token_validator_1 = __importDefault(require("../validators/token.validator"));
const token_listing_controller_1 = __importDefault(require("../controllers/token_listing.controller"));
const tokenlist_validator_1 = __importDefault(require("../validators/tokenlist.validator"));
const service_1 = __importDefault(require("../services/service"));
class tokenRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let tokens = new token_controller_1.default();
        let tone_list = new token_listing_controller_1.default();
        let auth = new authController_1.default().auth;
        // ===============================================
        // Frontend client routes
        // ===============================================
        this.router.get('/', tokens.tokenAll);
        this.router.get('/future', tokens.futureTokenAll);
        /**
         * Token listed by user from frontend
        **/
        // this.router.post('/create', auth, service.upload.upload("token", ['jpg', 'png', 'svg'], 2, [
        //     {
        //         name: "image",
        //         maxCount: 1,
        //     },
        // ]), super.Validator(tokenSchema.create), tokens.create);
        this.router.post('/token/create', auth, super.Validator(token_validator_1.default.create), tokens.create);
        /**
        * Top gainer token list
        */
        this.router.get('/topgainer', tone_list.topGainerList);
        // ===============================================
        // Admin routes
        // ===============================================
        this.router.get('/list/all', tokens.adminTokenAll);
        /**
         * get token list using offset and page limit
         */
        this.router.get('/all/:offset/:limit', auth, tokens.tokenAllWithLimit);
        /**
         * Listed token edit by admin in dashboard
        **/
        // this.router.post('/edit', auth, service.upload.upload("token", ['jpg', 'png', 'svg'], 2, [
        //     {
        //         name: "image",
        //         maxCount: 1,
        //     },
        // ]), super.Validator(tokenSchema.edit), tokens.edit);
        this.router.post('/token/edit', auth, super.Validator(token_validator_1.default.edit), tokens.edit);
        /**
         * Admin active/Inactive token that show on frontend
         */
        this.router.put('/change/status', auth, tokens.activeInactiveToken);
        /**
         * Admin enable/disable stake status
         */
        this.router.put('/stake/status', auth, tokens.stakeStatus);
        /**
         *  New token listed by admin
         */
        this.router.post('/token_list/create', auth, service_1.default.upload.upload("token", ['jpg', 'png'], 2, [
            {
                name: "logo",
                maxCount: 1,
            },
        ]), super.Validator(tokenlist_validator_1.default.create), tone_list.create);
        /**
         * //get admin listed token list
         */
        this.router.get('/list', tone_list.tokenList);
        /**
         * Add global token network/chain
         */
        this.router.post('/update/network', auth, tokens.updateNetwork);
    }
}
exports.default = new tokenRoutes().router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const tradepair_controller_1 = __importDefault(require("../controllers/tradepair.controller"));
const tradepair_validator_1 = __importDefault(require("../validators/tradepair.validator"));
class tradePairRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let tradePair = new tradepair_controller_1.default();
        let auth = new authController_1.default().auth;
        let middleware = new authController_1.default();
        // ===============================================
        // Frontend client routes
        // ===============================================
        // this.router.get('/', tradePair.allPairs); 
        this.router.get('/:offset/:limit', middleware.auth, tradePair.allPairsByLimit);
        /**
         * Trade Pair listed by user from frontend
        **/
        this.router.post('/create', middleware.auth, super.Validator(tradepair_validator_1.default.create), tradePair.create);
        /**
        * Top gainer token list
        */
        // this.router.get('/topgainer', tone_list.topGainerList);
        // ===============================================
        // Admin routes
        // ===============================================
        // this.router.get('/list/all', tokens.adminTokenAll);
        /**
         * Listed token edit by admin in dashboard
        **/
        this.router.post('/edit', middleware.auth, super.Validator(tradepair_validator_1.default.edit), tradePair.edit);
        /**
         * Admin active/Inactive token that show on frontend
         */
        this.router.put('/change/status', middleware.auth, tradePair.activeInactivePair);
        /**
         *  New token listed by admin
         */
        // this.router.post('/token_list/create', auth, service.upload.upload("token", ['jpg', 'png'], 2, [
        //     {
        //         name: "logo",
        //         maxCount: 1,
        //     },
        // ]), super.Validator(tokenListingSchema.create), tone_list.create);
        /**
         * //get admin listed token list
         */
        // this.router.get('/list', tone_list.tokenList);
    }
}
exports.default = new tradePairRoutes().router;

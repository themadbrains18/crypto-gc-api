"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const kyc_controller_1 = __importDefault(require("../controllers/kyc.controller"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const kyc_validator_1 = __importDefault(require("../validators/kyc.validator"));
class kycRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let kyc = new kyc_controller_1.default();
        let middleware = new authController_1.default();
        this.router.post("/kyc/create", middleware.auth, kyc.create);
        // this.router.post("/create",service.upload.upload("../upload",['pdf','png','jpg']), super.Validator(kycSchema.create),auth, kyc.create);
        this.router.post("/institute/create", middleware.auth, kyc.institutecreate);
        this.router.get("/:id", middleware.auth, kyc.kycById);
        this.router.put("/kycstatus", middleware.auth, super.Validator(kyc_validator_1.default.status), kyc.kycStatus);
        this.router.get("/all/:type", kyc.kycAll);
        this.router.get("/allByLimit/:type/:offset/:limit", middleware.auth, kyc.kycAllByLimit);
    }
}
exports.default = new kycRoutes().router;

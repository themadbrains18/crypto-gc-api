"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const staking_validator_1 = __importDefault(require("../validators/staking.validator"));
const staking_controller_1 = __importDefault(require("../controllers/staking.controller"));
class stakingRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let staking = new staking_controller_1.default();
        let auth = new authController_1.default().auth;
        this.router.post('/create', super.Validator(staking_validator_1.default.create), auth, staking.saveStaking);
        this.router.put('/release', super.Validator(staking_validator_1.default.release), auth, staking.stakingRelease);
        this.router.get('/all', auth, staking.getAllStaking);
        this.router.get('/getbytoken/:tokenid/:userid', auth, staking.getStakedByToken);
        this.router.put('/unstaking', auth, staking.unstakingToken);
        //==============================================================//
        // admin add token stake for user where user add staking on token
        //==============================================================//
        this.router.post('/admin/create', super.Validator(staking_validator_1.default.adminstake), staking.saveTokenStake);
    }
}
exports.default = new stakingRoutes().router;

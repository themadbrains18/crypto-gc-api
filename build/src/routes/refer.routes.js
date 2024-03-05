"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const referal_controller_1 = __importDefault(require("../controllers/referal.controller"));
const referProgram_controller_1 = __importDefault(require("../controllers/referProgram.controller"));
class referRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let refer = new referal_controller_1.default();
        let middleware = new authController_1.default();
        let referProgram = new referProgram_controller_1.default();
        this.router.get('/getbyuser/:userid', middleware.auth, refer.getUserReferalList);
        this.router.get('/getbyuser/:userid/:offset/:limit', middleware.auth, refer.getUserReferalListByLimit);
        this.router.get('/all', referProgram.getAllActiveEvent);
        this.router.get('/event/:name', referProgram.getSingleEvent);
        this.router.get('/rewards/all/:userid', middleware.auth, refer.getUserRewards);
        this.router.post('/rewards/create', middleware.auth, refer.createUserRewards);
        this.router.put('/rewards/update', middleware.auth, refer.updateUserRewards);
        this.router.get('/rewards/detail/single/:userid/:rewardid', middleware.auth, refer.getRewardsDetailById);
        // Admin create refer program 
        this.router.post('/create', middleware.auth, referProgram.saveReferProgram);
        this.router.put('/edit', middleware.auth, referProgram.editReferProgram);
        this.router.put('/update/status', middleware.auth, referProgram.changeStatus);
        this.router.post('/create/invite', middleware.auth, referProgram.saveReferProgramInvite);
        // Refer program Admin API
        this.router.get('/:offset/:limit', middleware.auth, referProgram.getAll);
    }
}
exports.default = new referRoutes().router;

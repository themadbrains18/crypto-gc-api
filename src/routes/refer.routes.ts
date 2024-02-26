import { Application, Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import ReferalController from "../controllers/referal.controller";
import referProgramController from "../controllers/referProgram.controller";

class referRoutes extends BaseController {
    router = Router();

    constructor() {
        super()
        this.init();

    }

    init() {
        let refer = new ReferalController();
        let middleware = new authController();
        let referProgram = new referProgramController();

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
        this.router.get('/:offset/:limit',middleware.auth, referProgram.getAll);

    }
}

export default new referRoutes().router;
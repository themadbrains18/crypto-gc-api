import { Application, Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import ReferalController from "../controllers/referal.controller";
import referProgramController from "../controllers/referProgram.controller";

class referRoutes extends BaseController {
    router = Router();
    /**
     * Initializes the routes related to referral programs, user rewards,
     * and admin management of referral events.
     */
    constructor() {
        super()
        this.init();

    }
   /**
     * Defines the routes for user referrals, rewards, and referral programs:
     * - `/getbyuser/:userid` - Get a list of referrals for a specific user.
     * - `/getbyuser/:userid/:offset/:limit` - Get a paginated list of referrals for a specific user.
     * - `/all` - Get all active referral programs.
     * - `/event/:name` - Get details of a single referral event by name.
     * - `/rewards/all/:userid` - Get all rewards of a user.
     * - `/rewards/create` - Create a new reward for a user.
     * - `/rewards/update` - Update a user's reward.
     * - `/rewards/detail/single/:userid/:rewardid` - Get details of a single reward by user and reward ID.
     * - `/create` - Admin route to create a new referral program.
     * - `/edit` - Admin route to edit an existing referral program.
     * - `/update/status` - Admin route to change the status of a referral program.
     * - `/create/invite` - Admin route to create an invitation for a referral program.
     * - `/:offset/:limit` - Admin route to get all referral programs with pagination.
     */
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
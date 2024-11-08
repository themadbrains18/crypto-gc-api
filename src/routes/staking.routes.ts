import { Application, Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import stakingSchema from "../validators/staking.validator";
import stakingController from "../controllers/staking.controller";

class stakingRoutes extends BaseController {
    /**
 * Routes for managing staking-related operations.
 * These routes allow users to stake, release, unstake tokens, and manage staking information.
 * Admins can also manage staking for users.
 */
    router =  Router();
    /**
     * Initializes the routes for staking operations:
     * - `/create` - User creates a new staking position.
     * - `/release` - User releases a staking position.
     * - `/all` - Get all staking positions of a user.
     * - `/all/:offset/:limit` - Get all staking positions with pagination.
     * - `/getbytoken/:tokenid/:userid` - Get staking details by token and user.
     * - `/unstaking` - Unstake a token.
     * - `/admin/create` - Admin creates a staking position for a user.
     */
    constructor(){
        super()
        this.init();

    }
    /**
     * Defines the routes for staking operations:
     * - `/create` - Route for users to create a staking position (requires authentication and validation).
     * - `/release` - Route for users to release a staking position (requires authentication and validation).
     * - `/all` - Get all staking positions (requires authentication).
     * - `/all/:offset/:limit` - Get all staking positions with pagination (requires authentication).
     * - `/getbytoken/:tokenid/:userid` - Get staking details by token and user (requires authentication).
     * - `/unstaking` - Unstake a token (requires authentication).
     * - `/admin/create` - Admin route to create a staking position for a user (requires authentication and validation).
     */
    init(){
        let staking = new stakingController();
        let auth = new authController().auth;

        this.router.post('/create',super.Validator(stakingSchema.create),auth,staking.saveStaking );
        this.router.put('/release',super.Validator(stakingSchema.release),auth,staking.stakingRelease);
        this.router.get('/all',auth,staking.getAllStaking);
        this.router.get('/all/:offset/:limit',auth,staking.getAllStakingByLimit);
        this.router.get('/getbytoken/:tokenid/:userid',auth,staking.getStakedByToken);
        this.router.put('/unstaking',auth,staking.unstakingToken);

        //==============================================================//
        // admin add token stake for user where user add staking on token
        //==============================================================//
        
        this.router.post('/admin/create',super.Validator(stakingSchema.adminstake),staking.saveTokenStake );

    }
}

export default new stakingRoutes().router;
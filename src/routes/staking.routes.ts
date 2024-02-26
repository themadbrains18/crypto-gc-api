import { Application, Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import stakingSchema from "../validators/staking.validator";
import stakingController from "../controllers/staking.controller";

class stakingRoutes extends BaseController {
    router =  Router();

    constructor(){
        super()
        this.init();

    }

    init(){
        let staking = new stakingController();
        let auth = new authController().auth;

        this.router.post('/create',super.Validator(stakingSchema.create),auth,staking.saveStaking );
        this.router.put('/release',super.Validator(stakingSchema.release),auth,staking.stakingRelease);
        this.router.get('/all',auth,staking.getAllStaking);
        this.router.get('/getbytoken/:tokenid/:userid',auth,staking.getStakedByToken);
        this.router.put('/unstaking',auth,staking.unstakingToken);

        //==============================================================//
        // admin add token stake for user where user add staking on token
        //==============================================================//
        
        this.router.post('/admin/create',super.Validator(stakingSchema.adminstake),staking.saveTokenStake );

    }
}

export default new stakingRoutes().router;
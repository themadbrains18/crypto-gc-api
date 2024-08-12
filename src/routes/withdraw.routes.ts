import { Application, Router } from "express";
import authController from "../middlewares/authController";
import withdrawController from "../controllers/withdraw.controller";
import BaseController from "../controllers/main.controller";
import withdrawSchema from "../validators/withdraw.validator";
import roles from "../middlewares/_helper/roles";


class withdrawRoutes extends BaseController  {
    router =  Router();

    constructor(){
        super();
        this.init();
    }
    init(){
        let withdraw = new withdrawController();
        let middleware = new authController();
        // this.router.get('/getToken/:id/:type', withdraw.tokenDetail);
        this.router.post('/create/withdraw',middleware.auth,super.Validator(withdrawSchema.create),withdraw.addnewRequest); 
        this.router.get('/list/:userid',middleware.auth, withdraw.withdrawListbyUserID);
        this.router.get('/history/:userid',middleware.auth, withdraw.userWithdrawHistory);
        this.router.get('/history/:userid/:offset/:limit/:currency/:date',middleware.auth, withdraw.userWithdrawHistoryByLimit);
          //=======================================================//
            //  admin can access this routes
        //=======================================================//
        
        // this.router.get('/admin/withdrawList',middleware.auth,middleware.permit(roles.admin,roles.superadmin),withdraw.withdrawList)
        // this.router.get('/admin/withdrawList',withdraw.withdrawList)
        this.router.get('/admin/withdrawListByLimit/:offset/:limit',middleware.auth,withdraw.withdrawListByLImit)
    }
}

export default new withdrawRoutes().router;
import { Application, Router } from "express";
import depositController from "../controllers/deposit.controller";

import authController from "../middlewares/authController";
import roles from "../middlewares/_helper/roles";

class depositRoutes  {
    router =  Router();

    constructor(){
        this.init();
    }

    init(){
        let deposit = new depositController();
        let middleware = new authController();

        // Create a new Tutorial
        this.router.post("/save", deposit.saveTransaction);
        this.router.post('/saveTrx',deposit.saveTRXTransaction)
        this.router.post('/saveTrc20',deposit.saveTRC20Transaction)
        this.router.get('/list/:id',middleware.auth,deposit.getdepositDetails);
        this.router.get('/history/:id',middleware.auth,deposit.getdepositHistory);
        this.router.get('/history/:id/:offset/:limit',middleware.auth,deposit.getdepositHistoryByLimit);
         //=======================================================//
            //  admin can access this routes
        //=======================================================//
        this.router.get('/admin/depositList',deposit.depositList)
        this.router.get('/admin/depositList/:offset/:limit',middleware.auth,deposit.depositListByLimit)
        // this.router.get('/admin/depositList',middleware.auth,middleware.permit(roles.admin,roles.superadmin),deposit.depositList)


    }
}

export default new depositRoutes().router;
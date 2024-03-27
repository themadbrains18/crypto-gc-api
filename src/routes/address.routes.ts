import { Application, Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import addressController from "../controllers/address.controller";


class addressRoutes extends BaseController  {
    router =  Router();

    constructor(){
        super();
        this.init();
    }
    init(){
        let address = new addressController();
        let middleware = new authController();
        // this.router.get('/getToken/:id/:type', withdraw.tokenDetail);
        this.router.post('/create',middleware.auth,address.create); 
        this.router.get('/list/:userid',middleware.auth, address.userAddress);
        this.router.put('/change/status', middleware.auth, address.activeInactiveAddress);
        // this.router.get('/history/:userid',middleware.auth, withdraw.userWithdrawHistory);
        // this.router.get('/history/:userid/:offset/:limit',middleware.auth, withdraw.userWithdrawHistoryByLimit);

    }
}

export default new addressRoutes().router;
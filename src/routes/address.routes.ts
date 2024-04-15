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
        this.router.post('/create',middleware.auth,address.create); 
        this.router.get('/list',middleware.auth, address.userAddress);
        this.router.put('/change/status', middleware.auth, address.activeInactiveAddress);
        this.router.delete('/delete/:addressid/:userid',middleware.auth,address.deleteAddress);
    }
}

export default new addressRoutes().router;
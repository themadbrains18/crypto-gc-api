import { Application, Router } from "express";
import otpController from "../controllers/opt.controller";

class otpRoutes  {
    router =  Router();

    constructor(){
        this.init();
    }

    init(){
        let otp = new otpController();
        this.router.post("/otp-verification", otp.match);
    }
}

export default new otpRoutes().router;
import { Router } from "express";
import authController from "../middlewares/authController";
import walletController from "../controllers/wallet.controller";
import BaseController from "../controllers/main.controller";
// import roles from "../middlewares/_helper/roles";

class walletRoutes extends BaseController  {
    router =  Router();

    constructor(){
        super()
        this.init();
    }

    init(){
        let wallets = new walletController();
        let middleware = new authController();

        this.router.get('/:user_id/:network',middleware.auth,wallets.getWalletAddressByuserIdAndNetwork);
    }
}

export default new walletRoutes().router;
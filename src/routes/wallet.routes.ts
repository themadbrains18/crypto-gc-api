import { Router } from "express";
import authController from "../middlewares/authController";
import walletController from "../controllers/wallet.controller";
import BaseController from "../controllers/main.controller";

/**
 * Wallet-related routes.
 * Includes routes for fetching wallet address by user and network.
 */
class walletRoutes extends BaseController {
    router = Router();

    /**
     * Initializes the wallet routes.
     * Defines all endpoints related to wallet management.
     */
    constructor() {
        super();
        this.init();
    }

    /**
     * Initializes the wallet routes and binds controller methods.
     */
    init() {
        let wallets = new walletController();
        let middleware = new authController();

        /**
         * Get wallet address by user ID and network.
         * Authenticated access required.
         */
        this.router.get('/:user_id/:network', middleware.auth, wallets.getWalletAddressByuserIdAndNetwork);
    }
}

export default new walletRoutes().router;

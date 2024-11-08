import { Application, Router } from "express";
import assetsController from "../controllers/assets.controller";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import assetSchema from "../validators/assets.validator";

class assetsRoutes extends BaseController {
    router = Router();

    /**
     * Initializes the asset routes and sets up middleware.
     * All the asset routes are registered with proper HTTP methods, 
     * route paths, authentication, validation, and controller actions.
     */
    constructor() {
        super()
        this.init();
    }

    /**
     * Initializes the routes for handling asset-related actions.
     * The routes include asset listing, wallet transfer, asset overview, 
     * and asset creation, along with authentication middleware.
     */
    init() {
        let assets = new assetsController();
        let auth = new authController().auth;
        let middleware = new authController();

        /**
         * Route to get a list of assets.
         * Requires authentication.
         */
        this.router.get('/', auth, assets.assetsList);

        /**
         * Route to get a paginated list of assets.
         * Requires authentication and pagination parameters.
         */
        this.router.get('/:offset/:limit', auth, assets.assetsListByLimit);

        /**
         * Route to get the asset overview for a specific user.
         * Requires authentication.
         */
        this.router.get('/:userid', middleware.auth, assets.assetsOverview);

        /**
         * Route for wallet-to-wallet transfer.
         * Requires authentication and validates the payload against the wallet schema.
         */
        this.router.post('/wallettransfer', middleware.auth, super.Validator(assetSchema.walletTowallet), assets.walletTowalletTranserfer);

        /**
         * Route to get an overview of assets for a user.
         * Requires authentication.
         */
        this.router.get('/overview/:userid', middleware.auth, assets.assetsOverview);

        /**
         * Route to get a paginated overview of assets for a user.
         * Requires authentication and pagination parameters.
         */
        this.router.get('/overview/:userid/:offset/:limit', auth, assets.assetsOverviewByLimit);

        /**
         * Route to get a filtered overview of assets by type.
         * Requires authentication and pagination parameters.
         */
        this.router.get('/type/:type/:offset/:limit', auth, assets.assetsOverviewByType);

        /**
         * Route to get the transfer history of assets for a user.
         * Requires authentication.
         */
        this.router.get('/history/:userid', auth, assets.transferHistory);

        /**
         * Route to create a new asset entry.
         * Requires authentication and validates the request body.
         */
        this.router.post('/create', super.Validator(assetSchema.create), middleware.auth, assets.create);
    }
}

export default new assetsRoutes().router;

import { Application, Router } from "express";
import assetsController from "../controllers/assets.controller";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import assetSchema from "../validators/assets.validator";

class assetsRoutes extends BaseController {
    router = Router();

    constructor() {
        super()
        this.init();

    }

    init() {
        let assets = new assetsController();
        let auth = new authController().auth;
        let middleware = new authController();

        this.router.get('/', auth, assets.assetsList);
        this.router.get('/:offset/:limit',auth, assets.assetsListByLimit);
        this.router.get('/:userid', middleware.auth, assets.assetsOverview);
        this.router.post('/wallettransfer', middleware.auth, super.Validator(assetSchema.walletTowallet), assets.walletTowalletTranserfer);
        this.router.get('/overview/:userid', middleware.auth, assets.assetsOverview);
        this.router.get('/overview/:userid/:offset/:limit',auth, assets.assetsOverviewByLimit);
        this.router.get('/history/:userid', auth, assets.transferHistory);

        this.router.post('/create', super.Validator(assetSchema.create), middleware.auth, assets.create);

    }
}

export default new assetsRoutes().router;
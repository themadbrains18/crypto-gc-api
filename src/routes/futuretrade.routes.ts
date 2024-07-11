import { Application, Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import futuretradePairSchema from "../validators/futurepair.validator";
import futureTradePairController from "../controllers/futurepair.controller";


class futureTradePairRoutes extends BaseController {
    router = Router();

    constructor() {
        super()
        this.init();
    }

    init() {

        let tradePair = new futureTradePairController();
        let middleware = new authController();

        // ===============================================
        // Frontend client routes
        // ===============================================

        this.router.get('/:name', tradePair.allPairs);
        this.router.get('/:offset/:limit', middleware.auth, tradePair.allPairsByLimit);

        /**
         * Trade Pair listed by user from frontend 
        **/
        this.router.post('/create', middleware.auth, super.Validator(futuretradePairSchema.create), tradePair.create);

        /**
         * Listed token edit by admin in dashboard 
        **/

        this.router.post('/edit', middleware.auth, super.Validator(futuretradePairSchema.edit), tradePair.edit);

        /**
         * Admin active/Inactive token that show on frontend
         */
        this.router.put('/change/status', middleware.auth, tradePair.activeInactivePair);



    }
}

export default new futureTradePairRoutes().router;
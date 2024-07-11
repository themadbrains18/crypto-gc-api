import { Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import profitLossController from "../controllers/profitloss.controller";
import profitLossSchema from "../validators/profitloss.validator";

class profitLossRoutes extends BaseController {
    router = Router();

    constructor() {
        super()
        this.init();
    }

    init() {

        let profitLoosPosition = new profitLossController();
        let middleware = new authController();
        /**
         * Create new position 
        **/
        this.router.post('/create', middleware.auth, super.Validator(profitLossSchema.create), profitLoosPosition.create);
        this.router.get('/all', middleware.auth, profitLoosPosition.allOrder);
        this.router.delete('/close/:id', middleware.auth, profitLoosPosition.close)

    }
}

export default new profitLossRoutes().router;
import { Application, Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import futureOpenOrderSchema from "../validators/futureOpenOrder.validator";
import futureOpenOrderController from "../controllers/futureOpenOrder.controller";


class futureOpenOrderRoutes extends BaseController {
    router = Router();

    constructor() {
        super()
        this.init();
    }

    init() {

        let tradeOpenOrder = new futureOpenOrderController();
        let middleware = new authController();

        this.router.get('/:userid', tradeOpenOrder.allOpenOrder); 
        this.router.get('/:offset/:limit',middleware.auth, tradeOpenOrder.allOpenByLimit); 

        /**
         * Create new position 
        **/
        this.router.post('/create',middleware.auth, super.Validator(futureOpenOrderSchema.create), tradeOpenOrder.create);

        /**
         * Edit trade position
        **/
        this.router.post('/edit',middleware.auth,super.Validator(futureOpenOrderSchema.edit), tradeOpenOrder.edit);

        /**
         * Close open order
         */

        this.router.delete('/close/:id', middleware.auth, tradeOpenOrder.deleteRequest);

        /**
         * Get user open order history data
         */

        this.router.get('/all/history/:userid',middleware.auth, tradeOpenOrder.history);
        
    }
}

export default new futureOpenOrderRoutes().router;
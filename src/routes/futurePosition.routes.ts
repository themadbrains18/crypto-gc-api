import { Application, Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import futurePositionSchema from "../validators/futurePosition.validator";
import futurePositionController from "../controllers/futurePosition.controller";


class futurePostionRoutes extends BaseController {
    router = Router();

    constructor() {
        super()
        this.init();
    }

    init() {

        let tradePPosition = new futurePositionController();
        let middleware = new authController();

        this.router.get('/:userid', middleware.auth, tradePPosition.allPositionOrder);
        this.router.get('/:offset/:limit', middleware.auth, tradePPosition.allPositionByLimit);
        this.router.put('/update-leverage/:coinid', middleware.auth, tradePPosition.updateLeverage);

        /*
         * Create new position 
        **/
        this.router.post('/create', middleware.auth, super.Validator(futurePositionSchema.create), tradePPosition.create);

        /**
         * Edit trade position
        **/

        this.router.post('/edit', middleware.auth, super.Validator(futurePositionSchema.edit), tradePPosition.edit);

        /**
         * Close single single position
         */
        this.router.delete('/close/:id', middleware.auth, tradePPosition.deleteRequest);

        /**
         * Close All position
         */

        this.router.post('/close/all', middleware.auth, tradePPosition.closeAllPositionRequest);

        /**
         * Get user position history data
         */

        this.router.get('/all/history/:userid',middleware.auth, tradePPosition.history);

        this.router.get('/hloc/coindata/:coinid', tradePPosition.getLastDayData);

        this.router.get('/coin/orderbook/:coinid', tradePPosition.getorbookder);

    }
}

export default new futurePostionRoutes().router;
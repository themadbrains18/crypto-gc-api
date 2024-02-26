import { Application, Router } from "express";
import authController from "../middlewares/authController";
import watchlistController from "../controllers/watchlist.controller";
import BaseController from "../controllers/main.controller";

class watchlistRoutes extends BaseController {
    router = Router();

    constructor() {
        super()
        this.init();
    }

    init() {

        let watchlist = new watchlistController();
        let auth = new authController().auth;

        this.router.get('/:user_id', auth, watchlist.all);

        /**
         * Token listed in watchlist
        **/
        this.router.post('/create', auth, watchlist.create);

        this.router.post('/encriypt', watchlist.encriypt);

        this.router.post('/dcrypt',watchlist.dcrypt);

    }
}

export default new watchlistRoutes().router;
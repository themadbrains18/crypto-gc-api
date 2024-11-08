import { Application, Router } from "express";
import authController from "../middlewares/authController";
import watchlistController from "../controllers/watchlist.controller";
import BaseController from "../controllers/main.controller";

/**
 * Watchlist-related routes.
 * Includes routes for managing and interacting with the user's watchlist.
 */
class watchlistRoutes extends BaseController {
    router = Router();

    /**
     * Initializes the watchlist routes.
     * Sets up all the watchlist-related endpoints.
     */
    constructor() {
        super();
        this.init();
    }

    /**
     * Initializes the watchlist routes and binds controller methods.
     */
    init() {
        let watchlist = new watchlistController();
        let auth = new authController().auth;

        /**
         * Get all items in the user's watchlist.
         * Requires authentication.
         */
        this.router.get('/:user_id', auth, watchlist.all);

        /**
         * Add a token to the user's watchlist.
         * Requires authentication.
         */
        this.router.post('/create', auth, watchlist.create);

        /**
         * Encrypt the watchlist data.
         */
        this.router.post('/encriypt', watchlist.encriypt);

        /**
         * Decrypt the watchlist data.
         */
        this.router.post('/dcrypt', watchlist.dcrypt);
    }
}

export default new watchlistRoutes().router;

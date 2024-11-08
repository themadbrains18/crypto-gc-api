import { Application, Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import tradePairSchema from "../validators/tradepair.validator";
import service from "../services/service";
import tradePairController from "../controllers/tradepair.controller";

/**
 * Routes related to managing trade pairs on the platform.
 * This includes routes for creating, editing, activating, and managing trade pairs for both frontend users and admin users.
 */
class tradePairRoutes extends BaseController {
    router = Router();

    /**
     * Initializes the trade pair routes.
     * Sets up routes for frontend users to create and view trade pairs, and admin routes for managing trade pair status.
     */
    constructor() {
        super();
        this.init();
    }

    /**
     * Defines the routes for managing trade pairs:
     * - Frontend routes for listing and creating trade pairs.
     * - Admin routes for editing and managing trade pair status.
     */
    init() {

        let tradePair = new tradePairController();
        let auth = new authController().auth;
        let middleware = new authController();

        // ===============================================
        // Frontend client routes
        // ===============================================

        /**
         * Route to get all trade pairs with pagination.
         * Requires `offset` and `limit` to paginate results.
         */
        this.router.get('/:offset/:limit', middleware.auth, tradePair.allPairsByLimit);

        /**
         * Route to create a new trade pair.
         * Requires user authentication and validates the request with the `tradePairSchema.create` validator.
         */
        this.router.post('/create', middleware.auth, super.Validator(tradePairSchema.create), tradePair.create);
 /**
        * Top gainer token list
        */
      // this.router.get('/topgainer', tone_list.topGainerList);
        // ===============================================
        // Admin routes
        // ===============================================
// this.router.get('/list/all', tokens.adminTokenAll);
        /**
         * Route to edit an existing trade pair.
         * Admins can modify trade pair details such as name, symbols, etc.
         */
        this.router.post('/edit', middleware.auth, super.Validator(tradePairSchema.edit), tradePair.edit);

        /**
         * Route to change the status of a trade pair (active/inactive).
         * Admins can control whether a trade pair is visible on the frontend.
         */
        this.router.put('/change/status', middleware.auth, tradePair.activeInactivePair);
          /**
         *  New token listed by admin 
         */
        // this.router.post('/token_list/create', auth, service.upload.upload("token", ['jpg', 'png'], 2, [
        //     {
        //         name: "logo",
        //         maxCount: 1,
        //     },
        // ]), super.Validator(tokenListingSchema.create), tone_list.create);

        /**
         * //get admin listed token list
         */
        // this.router.get('/list', tone_list.tokenList);
    }
}

export default new tradePairRoutes().router;

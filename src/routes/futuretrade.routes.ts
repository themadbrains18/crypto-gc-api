import { Application, Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import futuretradePairSchema from "../validators/futurepair.validator";
import futureTradePairController from "../controllers/futurepair.controller";

class futureTradePairRoutes extends BaseController {
  router = Router();

  /**
   * Initializes the future trade pair routes, sets up necessary middleware,
   * and defines all the routes related to trade pairs.
   */
  constructor() {
    super();
    this.init();
  }

  /**
   * Sets up the routes for managing trade pairs, including routes for creating, 
   * editing, and changing the status of trade pairs, as well as fetching trade pairs.
   */
  init() {

    let tradePair = new futureTradePairController();
    let middleware = new authController();

    // ===============================================
    // Frontend client routes
    // ===============================================

    /**
     * Route to get all trade pairs by name.
     * No authentication required.
     */
    this.router.get('/:name', tradePair.allPairs);

    /**
     * Route to get trade pairs with pagination.
     * Requires authentication.
     */
    this.router.get('/:offset/:limit', middleware.auth, tradePair.allPairsByLimit);

    /**
     * Route to create a new trade pair listed by the user from the frontend.
     * Requires authentication and request validation.
     */
    this.router.post('/create', middleware.auth, super.Validator(futuretradePairSchema.create), tradePair.create);

    /**
     * Route to edit a listed trade pair by the admin in the dashboard.
     * Requires authentication and request validation.
     */
    this.router.post('/edit', middleware.auth, super.Validator(futuretradePairSchema.edit), tradePair.edit);

    /**
     * Route to activate or deactivate a trade pair for frontend visibility.
     * Requires authentication.
     */
    this.router.put('/change/status', middleware.auth, tradePair.activeInactivePair);
  }
}

export default new futureTradePairRoutes().router;

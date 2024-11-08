import { Application, Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import futurePositionSchema from "../validators/futurePosition.validator";
import futurePositionController from "../controllers/futurePosition.controller";

class futurePostionRoutes extends BaseController {
  router = Router();

  /**
   * Initializes the future position routes, sets up necessary middleware,
   * and defines all the routes related to managing trade positions.
   */
  constructor() {
    super();
    this.init();
  }

  /**
   * Sets up the routes for future positions and trade orders.
   * Includes routes for creating, editing, and closing positions, 
   * as well as fetching position data and historical information.
   */
  init() {

    let tradePPosition = new futurePositionController();
    let middleware = new authController();

    /**
     * Route to get all positions for a user by user ID.
     * Requires authentication.
     */
    this.router.get('/:userid', middleware.auth, tradePPosition.allPositionOrder);

    /**
     * Route to get all positions for a user with pagination.
     * Requires authentication.
     */
    this.router.get('/:offset/:limit', middleware.auth, tradePPosition.allPositionByLimit);

    /**
     * Route to create a new trade position.
     * Requires authentication and validation of the request body.
     */
    this.router.post('/create', middleware.auth, super.Validator(futurePositionSchema.create), tradePPosition.create);

    /**
     * Route to edit an existing trade position.
     * Requires authentication and validation of the request body.
     */
    this.router.post('/edit', middleware.auth, super.Validator(futurePositionSchema.edit), tradePPosition.edit);

    /**
     * Route to close a specific trade position by ID.
     * Requires authentication.
     */
    this.router.delete('/close/:id', middleware.auth, tradePPosition.deleteRequest);

    /**
     * Route to close all trade positions for a user.
     * Requires authentication.
     */
    this.router.post('/close/all', middleware.auth, tradePPosition.closeAllPositionRequest);

    /**
     * Route to get a user's trade position history.
     * Requires authentication.
     */
    this.router.get('/all/history/:userid', middleware.auth, tradePPosition.history);

    /**
     * Route to get the last day's data for a coin based on its ID.
     * No authentication required.
     */
    this.router.get('/hloc/coindata/:coinid', tradePPosition.getLastDayData);

    /**
     * Route to get the order book data for a coin based on its ID.
     * No authentication required.
     */
    this.router.get('/coin/orderbook/:coinid', tradePPosition.getorbookder);
  }
}

export default new futurePostionRoutes().router;

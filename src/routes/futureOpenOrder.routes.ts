import { Application, Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import futureOpenOrderSchema from "../validators/futureOpenOrder.validator";
import futureOpenOrderController from "../controllers/futureOpenOrder.controller";

class futureOpenOrderRoutes extends BaseController {
  router = Router();

  /**
   * Initializes the future open order routes, sets up necessary middleware,
   * and defines all the routes related to trade positions and open orders.
   */
  constructor() {
    super();
    this.init();
  }

  /**
   * Sets up the routes for future open orders and trade positions.
   * Includes routes for creating, editing, and closing orders, 
   * as well as fetching open orders and their history.
   */
  init() {
    let tradeOpenOrder = new futureOpenOrderController();
    let middleware = new authController();

    /**
     * Route to get all open orders for a user by user ID.
     * Does not require authentication.
     */
    this.router.get('/:userid', tradeOpenOrder.allOpenOrder);

    /**
     * Route to get all open orders for a user with pagination.
     * Requires authentication.
     */
    this.router.get('/:offset/:limit', middleware.auth, tradeOpenOrder.allOpenByLimit);

    /**
     * Route to create a new trade position.
     * Requires authentication and validation of the request body.
     */
    this.router.post('/create', middleware.auth, super.Validator(futureOpenOrderSchema.create), tradeOpenOrder.create);

    /**
     * Route to edit an existing trade position.
     * Requires authentication and validation of the request body.
     */
    this.router.post('/edit', middleware.auth, super.Validator(futureOpenOrderSchema.edit), tradeOpenOrder.edit);

    /**
     * Route to close an open order by its ID.
     * Requires authentication.
     */
    this.router.delete('/close/:id', middleware.auth, tradeOpenOrder.deleteRequest);

    /**
     * Route to close all open orders for a user.
     * Requires authentication.
     */
    this.router.post('/close/all', middleware.auth, tradeOpenOrder.deleteAllRequest);

    /**
     * Route to get a user's open order history.
     * Requires authentication.
     */
    this.router.get('/all/history/:userid', middleware.auth, tradeOpenOrder.history);
  }
}

export default new futureOpenOrderRoutes().router;

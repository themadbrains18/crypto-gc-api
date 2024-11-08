import { Application, Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import convertController from "../controllers/convert.controller";

class convertRoutes extends BaseController {
  router = Router();

  /**
   * Initializes the convert routes and sets up the necessary middleware.
   * The routes register endpoints for creating a conversion, 
   * retrieving the conversion list, and fetching conversion history.
   */
  constructor() {
    super();
    this.init();
  }

  /**
   * Sets up the routes for conversion functionality.
   * Includes routes for creating a conversion, fetching a list of conversions, 
   * and viewing conversion history with pagination support.
   * The routes also include authentication middleware.
   */
  init() {
    let convert = new convertController();
    let middleware = new authController();

    /**
     * Route to create a new conversion.
     * Requires authentication middleware.
     */
    this.router.post("/create", middleware.auth, convert.saveConvert);

    /**
     * Route to retrieve a list of conversions with pagination.
     * Requires authentication middleware.
     */
    this.router.get("/:offset/:limit", middleware.auth, convert.getConvertList);

    /**
     * Route to retrieve the full conversion history.
     * Requires authentication middleware.
     */
    this.router.get("/history", middleware.auth, convert.getConvertHistoryList);

    /**
     * Route to retrieve the conversion history with pagination.
     * Requires authentication middleware.
     */
    this.router.get("/history/:offset/:limit", middleware.auth, convert.getConvertHistoryListByLimit);
  }
}

export default new convertRoutes().router;

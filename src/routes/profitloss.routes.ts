import { Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import profitLossController from "../controllers/profitloss.controller";
import profitLossSchema from "../validators/profitloss.validator";

class profitLossRoutes extends BaseController {
    router = Router();

      /**
     * Initializes the routes for managing posts and ads.
     * Sets up routes for creating, editing, deleting, retrieving posts, 
     * getting balances, and managing ad statuses.
     */
    constructor() {
        super()
        this.init();
    }
    /**
     * Defines the routes for managing posts and advertisements:
     * - `/create` - Create a new ad post.
     * - `/balances/:id` - Retrieve the balance for a specific user by ID.
     * - `/get/all/:userid` - Retrieve all posts for a specific user.
     * - `/get/:offset/:limit` - Retrieve posts by a user with pagination.
     * - `/delete/:postid/:userid` - Delete a post by its ID.
     * - `/all/:userid/:offset/:limit/:currency/:pmMethod` - Get all ads with filters.
     * - `/get/:status/:offset/:limit/:currency/:pmMethod/:date` - Get posts by status with filters.
     * - `/ads/:id` - Retrieve a single ad post by its ID.
     * - `/edit` - Edit an existing ad post.
     * - `/update/status` - Update the status of an ad post.
     * - `/ordertotal/:userid` - Get the total number of orders for a specific user.
     */
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
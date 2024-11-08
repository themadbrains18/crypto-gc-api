import { Application, Router } from "express";
import authController from "../middlewares/authController";
import postController from "../controllers/post.controller";
import BaseController from "../controllers/main.controller";
import adsPostSchema from "../validators/ads.validator";

/**
 * Routes for managing posts and advertisements, including creating, editing, 
 * deleting, and retrieving posts by users, as well as managing ad statuses.
 */
class postRoutes extends BaseController {
    router = Router();

    /**
     * Initializes the routes for managing posts and ads.
     * Sets up routes for creating, editing, deleting, retrieving posts, 
     * getting balances, and managing ad statuses.
     */
    constructor() {
        super();
        this.init();
    }

    init() {
        let post = new postController();
        let auth = new authController().auth;

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
        this.router.post("/create", super.Validator(adsPostSchema.create), auth, post.create);
        this.router.get('/balances/:id', auth, post.getBlanceByuserID);
        this.router.get('/get/all/:userid', post.getPost);
        this.router.get('/get/:offset/:limit', auth, post.getPostByUser);
        this.router.delete('/delete/:postid/:userid', auth, post.deletePost);
        this.router.get('/all/:userid/:offset/:limit/:currency/:pmMethod', post.getAllAds);
        this.router.get('/get/:status/:offset/:limit/:currency/:pmMethod/:date', auth, post.getPostByUserByStatus);
        this.router.get('/ads/:id', auth, post.getSingleAdsById);
        this.router.post("/edit", super.Validator(adsPostSchema.edit), auth, post.edit);
        this.router.put("/update/status", super.Validator(adsPostSchema.status), auth, post.updateStatus);
        this.router.get('/ordertotal/:userid', post.getTotalOrdersByUser);
    }
}

export default new postRoutes().router;
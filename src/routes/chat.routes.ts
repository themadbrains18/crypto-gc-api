import { Application, Router } from "express";
import authController from "../middlewares/authController";
import chatController from "../controllers/chat.controller";
import BaseController from "../controllers/main.controller";
import chatSchema from "../validators/chat.validator";

class chatRoutes extends BaseController {
    router =  Router();

    /**
     * Initializes the chat routes and sets up the necessary middleware.
     * The routes register endpoints for creating chats and fetching all chats by order ID.
     */
    constructor(){
        super();
        this.init();
    }

    /**
     * Sets up the routes for chat functionality.
     * Includes routes to create a new chat and retrieve all chats by order ID.
     * The routes also include validation and authentication middleware.
     */
    init(){
        let chat = new chatController();
        let auth = new authController().auth;
        
        /**
         * Route to create a new chat.
         * Requires authentication and request body validation.
         */
        this.router.post("/create", super.Validator(chatSchema.create), auth, chat.create);

        /**
         * Route to retrieve all chats for a specific order ID.
         * This route does not require authentication.
         */
        this.router.get("/all/:orderid", chat.getChat);
    }
}

export default new chatRoutes().router;

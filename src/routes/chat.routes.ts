import { Application, Router } from "express";
import authController from "../middlewares/authController";
import chatController from "../controllers/chat.controller";
import BaseController from "../controllers/main.controller";
import chatSchema from "../validators/chat.validator";

class chatRoutes extends BaseController {
    router =  Router();

    constructor(){
        super();
        this.init();
    }

    init(){
        let chat = new chatController();
        let auth = new authController().auth;
        
        this.router.post("/create",super.Validator(chatSchema.create),auth, chat.create);
        this.router.get("/all/:orderid", chat.getChat);
    }
}

export default new chatRoutes().router;
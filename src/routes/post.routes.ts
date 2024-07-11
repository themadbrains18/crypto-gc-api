import { Application, Router } from "express";
import authController from "../middlewares/authController";
import postController from "../controllers/post.controller";
import BaseController from "../controllers/main.controller";
import adsPostSchema from "../validators/ads.validator";

class postRoutes  extends BaseController{
    router =  Router();

    constructor(){
        super();
        this.init();
    }

    init(){
        let post = new postController();
        let auth = new authController().auth;

        this.router.post("/create",super.Validator(adsPostSchema.create),auth, post.create);
        this.router.get('/balances/:id',auth, post.getBlanceByuserID);
        this.router.get('/get/all',auth, post.getPost);
        this.router.get('/get/:offset/:limit',auth, post.getPostByUser);
        this.router.delete('/delete/:postid/:userid',auth,post.deletePost);
        this.router.get('/all/:userid/:offset/:limit/:currency/:pmMethod',post.getAllAds);
        this.router.get('/get/:status/:offset/:limit',auth,post.getPostByUserByStatus);
        this.router.get('/ads/:id', auth, post.getSingleAdsById);
        this.router.post("/edit",super.Validator(adsPostSchema.edit),auth, post.edit);
        this.router.put("/update/status",super.Validator(adsPostSchema.status),auth, post.updateStatus);
        this.router.get('/ordertotal/:userid', post.getTotalOrdersByUser);
    }
}

export default new postRoutes().router;
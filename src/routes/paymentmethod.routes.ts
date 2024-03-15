import { Application, Router } from "express";
import authController from "../middlewares/authController";
import paymentController from "../controllers/payment.controller";
import p_methodSchema from "../validators/p_method.validator";
import BaseController from "../controllers/main.controller";
import service from "../services/service";

class paymentMethodRoutes extends BaseController {
    router =  Router();

    constructor(){
        super();
        this.init();
    }

    init(){
        let payment = new paymentController();
        let auth = new authController().auth;

        this.router.post("/save",auth,super.Validator(p_methodSchema.create), payment.create); //Add new payment method from admin dashboard

        this.router.get("/list", payment.list);
        this.router.get("/method/:id", payment.single);
        this.router.put("/update", payment.updatePaymentMethod);
      
        this.router.post("/addmethod",auth, payment.addMethod); // create by users
        this.router.get("/get-method",auth, payment.getMethod); // get methods by user id 
        this.router.delete("/delete-method/:id", payment.deleteRequest); // delete methods by user id

    }
}

export default new paymentMethodRoutes().router;
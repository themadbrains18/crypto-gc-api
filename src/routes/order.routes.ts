import { Application, Router } from "express";
import authController from "../middlewares/authController";
import orderController from "../controllers/order.controller";
import BaseController from "../controllers/main.controller";
import p2pOrderSchema from "../validators/p2porder.validator";

class orderRoutes  extends BaseController{
    router =  Router();

    constructor(){
        super();
        this.init();
    }

    init(){
        let order = new orderController();
        let middleware = new authController();

        this.router.post("/create",super.Validator(p2pOrderSchema.create),middleware.auth, order.create);
        this.router.post('/release',super.Validator(p2pOrderSchema.release),middleware.auth, order.releaseOrder);
        this.router.put('/cancel',super.Validator(p2pOrderSchema.cancel),middleware.auth, order.cancelOrder);
        this.router.put('/update',super.Validator(p2pOrderSchema.update),middleware.auth, order.updateOrder);
        this.router.get('/all/:userid',middleware.auth, order.getOrderList);
        this.router.get('/all/:userid/:offset/:limit',middleware.auth, order.getOrderListByLimit);
        this.router.get('/order/:orderid', order.getOrderById);
        this.router.get('/slugverify/:orderid',middleware.auth, order.slugverify);
        this.router.post('/payment/method',middleware.auth, order.updatePaymentMethod);
        this.router.get('/admin/all', order.getAllOrderList);
        this.router.get('/admin/all/:offset/:limit',middleware.auth, order.getAllOrderListByLimit);

        //=================================
        //P2P Express 
        //=================================

        this.router.get('/express/cretae',order.expressCreate);

    }
}

export default new orderRoutes().router;
import { Application, Router } from "express";
import authController from "../middlewares/authController";
import marketOrderController from "../controllers/marketorder.controller";
import BaseController from "../controllers/main.controller";
import marketSchema from "../validators/market.validator";

class marketOrderRoutes  extends BaseController{
    router =  Router();

    constructor(){
        super();
        this.init();
    }

    init(){
        let market = new marketOrderController();
        let middleware = new authController();

        // =======================================================//
        // Below all routes for chart page apis
        // =======================================================//
        // Create a new Tutorial
        this.router.post("/create",middleware.auth,super.Validator(marketSchema.create), market.create);
        
        // get order list by token id
        this.router.get("/:token",market.getAll);

        // cancel order by order id
        this.router.put("/cancel",middleware.auth,super.Validator(marketSchema.cancel),market.cancelOrders);

        // get all open order by token id and userid
        this.router.get("/getOrder/:token/:userid",middleware.auth,market.getAllOrders);

        // get all open and other order history by token id and user id 
        this.router.get("/getOrderHistory/:token/:userid",middleware.auth,market.getAllOrdersHistory);
        
        // =======================================================//
        // Below route is used for history page api
        // =======================================================//
        // get all trade history by user id 
        this.router.get("/order/list/:userid",middleware.auth,market.getorders);
        this.router.get("/order/list/:userid/:offset/:limit/:currency/:date",middleware.auth,market.getordersByLimit);


        this.router.put('/trasfer/cron',market.socketMarket);
        this.router.get('/admin/all', market.getAllMarketOrderList);
        this.router.get('/admin/all/:offset/:limit',middleware.auth, market.getAllMarketOrderListByLimit);

    }
}

export default new marketOrderRoutes().router;
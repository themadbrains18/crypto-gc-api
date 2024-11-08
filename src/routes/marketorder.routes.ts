import { Application, Router } from "express";
import authController from "../middlewares/authController";
import marketOrderController from "../controllers/marketorder.controller";
import BaseController from "../controllers/main.controller";
import marketSchema from "../validators/market.validator";

class marketOrderRoutes  extends BaseController {
    router = Router();

    /**
     * Initializes the market order routes and sets up the necessary middleware 
     * and route handlers for market orders.
     */
    constructor() {
        super();
        this.init();
    }

    /**
     * Defines the routes related to market orders, including creating orders, 
     * fetching order lists, canceling orders, and handling order history.
     */
    init() {
        let market = new marketOrderController();
        let middleware = new authController();

        // =======================================================//
        // Below all routes for chart page apis
        // =======================================================//

        /**
         * Route to create a new market order.
         * Requires authentication and validates the request payload.
         */
        this.router.post("/create", middleware.auth, super.Validator(marketSchema.create), market.create);

        /**
         * Route to get all orders by token ID.
         * No authentication required.
         */
        this.router.get("/:token", market.getAll);

        /**
         * Route to cancel an order by order ID.
         * Requires authentication and validates the request payload.
         */
        this.router.put("/cancel", middleware.auth, super.Validator(marketSchema.cancel), market.cancelOrders);

        /**
         * Route to get all open orders by token ID and user ID.
         * Requires authentication.
         */
        this.router.get("/getOrder/:token/:userid", middleware.auth, market.getAllOrders);

        /**
         * Route to get all open and historical orders by token ID and user ID.
         * Requires authentication.
         */
        this.router.get("/getOrderHistory/:token/:userid", middleware.auth, market.getAllOrdersHistory);

        // =======================================================//
        // Below route is used for history page api
        // =======================================================//

        /**
         * Route to get the trade history by user ID.
         * Requires authentication.
         */
        this.router.get("/order/list/:userid", middleware.auth, market.getorders);

        /**
         * Route to get trade history by user ID with pagination.
         * Requires authentication.
         */
        this.router.get("/order/list/:userid/:offset/:limit/:currency/:date", middleware.auth, market.getordersByLimit);

        /**
         * Route to trigger the socket market process for order transfers.
         */
        this.router.put('/trasfer/cron', market.socketMarket);

        /**
         * Admin route to get all market orders.
         * No authentication required.
         */
        this.router.get('/admin/all', market.getAllMarketOrderList);

        /**
         * Admin route to get all market orders with pagination.
         * Requires authentication.
         */
        this.router.get('/admin/all/:offset/:limit', middleware.auth, market.getAllMarketOrderListByLimit);
    }
}

export default new marketOrderRoutes().router;

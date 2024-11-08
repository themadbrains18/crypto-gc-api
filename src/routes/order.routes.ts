import { Application, Router } from "express";
import authController from "../middlewares/authController";
import orderController from "../controllers/order.controller";
import BaseController from "../controllers/main.controller";
import p2pOrderSchema from "../validators/p2porder.validator";

/**
 * Routes for handling peer-to-peer (P2P) order operations.
 * Includes routes for creating, updating, canceling orders, 
 * as well as managing order lists and payment methods.
 */
class orderRoutes extends BaseController {
    router = Router();

    /**
     * Initializes the order routes and sets up the necessary middleware 
     * and route handlers for order operations.
     */
    constructor() {
        super();
        this.init();
    }

    /**
     * Defines the routes related to order management, including:
     * - Creating, updating, and canceling orders
     * - Fetching orders by user and order status
     * - Managing payment methods and admin order listings
     * 
     * P2P Express route for fast order creation is also set up.
     */
    init() {
        let order = new orderController();
        let middleware = new authController();

        // =======================================================//
        // Routes for general order operations
        // =======================================================//
        
        /**
         * Route to create a new order.
         * Requires authentication and the request is validated using p2pOrderSchema.
         */
        this.router.post("/create", super.Validator(p2pOrderSchema.create), middleware.auth, order.create);
        
        /**
         * Route to release an order.
         * Requires authentication and request validation.
         */
        this.router.post('/release', super.Validator(p2pOrderSchema.release), middleware.auth, order.releaseOrder);
        
        /**
         * Route to cancel an order.
         * Requires authentication and request validation.
         */
        this.router.put('/cancel', super.Validator(p2pOrderSchema.cancel), middleware.auth, order.cancelOrder);
        
        /**
         * Route to update an existing order.
         * Requires authentication and request validation.
         */
        this.router.put('/update', super.Validator(p2pOrderSchema.update), middleware.auth, order.updateOrder);
        
        /**
         * Route to fetch the list of orders by user ID.
         * Requires authentication.
         */
        this.router.get('/all/:userid', middleware.auth, order.getOrderList);
        
        /**
         * Route to fetch the list of orders by user ID with pagination.
         * Requires authentication.
         */
        this.router.get('/all/:userid/:offset/:limit', middleware.auth, order.getOrderListByLimit);
        
        /**
         * Route to fetch orders by status with pagination and filter options.
         * Requires authentication.
         */
        this.router.get('/list/:userid/:status/:offset/:limit/:currency/:date', middleware.auth, order.getOrderListByStatusByLimit);
        
        /**
         * Route to fetch a single order by order ID.
         * Requires authentication.
         */
        this.router.get('/order/:orderid', middleware.auth, order.getOrderById);
        
        /**
         * Route to verify the slug for an order.
         * Requires authentication.
         */
        this.router.get('/slugverify/:orderid', middleware.auth, order.slugverify);
        
        /**
         * Route to update the payment method for an order.
         * Requires authentication.
         */
        this.router.post('/payment/method', middleware.auth, order.updatePaymentMethod);

        // =======================================================//
        // Admin Routes for managing orders
        // =======================================================//

        /**
         * Route to fetch all orders for admin.
         * No authentication required for this route.
         */
        this.router.get('/admin/all', order.getAllOrderList);
        
        /**
         * Route to fetch all orders for admin with pagination.
         * Requires authentication.
         */
        this.router.get('/admin/all/:offset/:limit', middleware.auth, order.getAllOrderListByLimit);

        // ================================================//
        // Routes for Peer-to-Peer (P2P) Express functionality
        // ================================================//
        
        /**
         * Route to create an express P2P order.
         * No authentication required for this route.
         */
        this.router.get('/express/cretae', order.expressCreate);
    }
}

export default new orderRoutes().router;

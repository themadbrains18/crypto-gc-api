import { Application, Router } from "express";
import authController from "../middlewares/authController";
import paymentController from "../controllers/payment.controller";
import p_methodSchema from "../validators/p_method.validator";
import BaseController from "../controllers/main.controller";
import service from "../services/service";

/**
 * Routes for managing payment methods, including adding, updating, 
 * deleting, and retrieving payment methods by users or administrators.
 */
class paymentMethodRoutes extends BaseController {
    router = Router();

    /**
     * Initializes the payment method routes.
     * Sets up the routes for handling payment methods by both admins and users.
     */
    constructor() {
        super();
        this.init();
    }

    /**
     * Defines the payment method routes:
     * - `/save` - Admin creates a new payment method.
     * - `/list` - Retrieves a list of payment methods.
     * - `/method/:id` - Retrieves a single payment method by its ID.
     * - `/update` - Admin updates an existing payment method.
     * - `/addmethod` - Users create a new payment method.
     * - `/get-method` - Retrieves payment methods by user ID.
     * - `/delete-method/:id` - Deletes a payment method by its ID.
     */
    init() {
        let payment = new paymentController();
        let auth = new authController().auth;

        /**
         * Admin route to create a new payment method.
         * This is accessible from the admin dashboard.
         */
        this.router.post("/save", auth, super.Validator(p_methodSchema.create), payment.create);

        /**
         * Route to retrieve a list of all available payment methods.
         */
        this.router.get("/list", payment.list);

        /**
         * Route to retrieve details of a specific payment method by ID.
         */
        this.router.get("/method/:id", payment.single);

        /**
         * Admin route to update an existing payment method.
         */
        this.router.put("/update", payment.updatePaymentMethod);

        /**
         * User route to add a new payment method.
         */
        this.router.post("/addmethod", auth, payment.addMethod);

        /**
         * User route to get all payment methods associated with the user.
         */
        this.router.get("/get-method", auth, payment.getMethod);

        /**
         * Admin route to delete a payment method by its ID.
         */
        this.router.delete("/delete-method/:id", payment.deleteRequest);
    }
}

export default new paymentMethodRoutes().router;

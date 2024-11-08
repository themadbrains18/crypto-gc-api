import { Application, Router } from "express";
import authController from "../middlewares/authController";
import withdrawController from "../controllers/withdraw.controller";
import BaseController from "../controllers/main.controller";
import withdrawSchema from "../validators/withdraw.validator";
import roles from "../middlewares/_helper/roles";

/**
 * Withdraw-related routes.
 * Includes routes for handling withdrawal requests and administration.
 */
class withdrawRoutes extends BaseController {
    router = Router();

    /**
     * Initializes the withdraw routes.
     * Sets up all the withdrawal-related endpoints.
     */
    constructor() {
        super();
        this.init();
    }

    /**
     * Initializes the withdraw routes and binds controller methods.
     */
    init() {
        let withdraw = new withdrawController();
        let middleware = new authController();

        /**
         * Create a new withdrawal request.
         * Requires authentication and validation of request body.
         */
        this.router.post('/create/withdraw', middleware.auth, super.Validator(withdrawSchema.create), withdraw.addnewRequest);

        /**
         * Get the list of withdrawals by user ID.
         * Requires authentication.
         */
        this.router.get('/list/:userid', middleware.auth, withdraw.withdrawListbyUserID);

        /**
         * Get the withdrawal history by user ID.
         * Requires authentication.
         */
        this.router.get('/history/:userid', middleware.auth, withdraw.userWithdrawHistory);

        /**
         * Get the withdrawal history by user ID with pagination and filter options.
         * Requires authentication.
         */
        this.router.get('/history/:userid/:offset/:limit/:currency/:date', middleware.auth, withdraw.userWithdrawHistoryByLimit);

        // =======================================================//
        // Admin Routes
        // =======================================================//
 
        // this.router.get('/admin/withdrawList',middleware.auth,middleware.permit(roles.admin,roles.superadmin),withdraw.withdrawList)
        // this.router.get('/admin/withdrawList',withdraw.withdrawList)
        /**
         * Get the withdrawal list with pagination for admins.
         * Requires authentication.
         */
        this.router.get('/admin/withdrawListByLimit/:offset/:limit', middleware.auth, withdraw.withdrawListByLImit);
    }
}

export default new withdrawRoutes().router;

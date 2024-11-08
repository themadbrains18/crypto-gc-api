import { Application, Router } from "express";
import depositController from "../controllers/deposit.controller";

import authController from "../middlewares/authController";
import roles from "../middlewares/_helper/roles";

class depositRoutes {
  router = Router();

  /**
   * Initializes the deposit routes and sets up the necessary middleware.
   * Registers endpoints for handling deposit-related transactions, 
   * including saving deposits, retrieving deposit history, and admin-only routes.
   */
  constructor() {
    this.init();
  }

  /**
   * Sets up the routes for deposit functionality.
   * Includes routes for saving deposits, retrieving deposit details,
   * and getting deposit history with pagination.
   * Admin-only routes are also included for managing deposit data.
   */
  init() {
    let deposit = new depositController();
    let middleware = new authController();

    /**
     * Route to save a new transaction.
     */
    this.router.post("/save", deposit.saveTransaction);

    /**
     * Route to save a TRX transaction.
     */
    this.router.post('/saveTrx', deposit.saveTRXTransaction);

    /**
     * Route to save a TRC20 transaction.
     */
    this.router.post('/saveTrc20', deposit.saveTRC20Transaction);

    /**
     * Route to get deposit details for a user by their ID.
     * Requires authentication.
     */
    this.router.get('/list/:id', middleware.auth, deposit.getdepositDetails);

    /**
     * Route to get deposit history for a user by their ID.
     * Requires authentication.
     */
    this.router.get('/history/:id', middleware.auth, deposit.getdepositHistory);

    /**
     * Route to get deposit history for a user with pagination.
     * Requires authentication.
     */
    this.router.get('/history/:id/:offset/:limit/:currency/:date', middleware.auth, deposit.getdepositHistoryByLimit);

    // Admin-only routes
    /**
     * Route for the admin to get the list of all deposits.
     */
    this.router.get('/admin/depositList', deposit.depositList);

    /**
     * Route for the admin to get the list of deposits with pagination.
     * Requires authentication.
     */
    this.router.get('/admin/depositList/:offset/:limit', middleware.auth, deposit.depositListByLimit);

    //  for admin role-based access:
    // this.router.get('/admin/depositList', middleware.auth, middleware.permit(roles.admin, roles.superadmin), deposit.depositList);
  }
}

export default new depositRoutes().router;

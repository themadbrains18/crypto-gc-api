import { Application, Router } from "express";
import otpController from "../controllers/opt.controller";

/**
 * Routes for handling OTP (One-Time Password) verification.
 * Includes a route for matching OTPs.
 */
class otpRoutes {
    router = Router();

    /**
     * Initializes the OTP routes and sets up the route handler for OTP verification.
     */
    constructor() {
        this.init();
    }

    /**
     * Defines the OTP verification route:
     * - `/otp-verification` - Matches the OTP provided by the user.
     */
    init() {
        let otp = new otpController();
        
        /**
         * Route to verify the OTP provided by the user.
         * This endpoint handles OTP matching logic.
         */
        this.router.post("/otp-verification", otp.match);
    }
}

export default new otpRoutes().router;

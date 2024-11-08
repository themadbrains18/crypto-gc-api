import { Application, Router } from "express";
import authController from "../middlewares/authController";
import networkController from "../controllers/netwok.controller";
import BaseController from "../controllers/main.controller";
import networkSchema from "../validators/network.validator";
import roles from "../middlewares/_helper/roles";

/**
 * Routes for handling network-related operations.
 * Includes routes for fetching network data and creating new networks.
 */
class netwokRoutes extends BaseController {
    router = Router();

    /**
     * Initializes the network routes and sets up the necessary middleware 
     * and route handlers for network operations.
     */
    constructor() {
        super();
        this.init();
    }

    /**
     * Defines the routes related to network management, including fetching 
     * network details and creating new networks. Only admins or superadmins 
     * are permitted to create networks.
     */
    init() {
        let networks = new networkController();
        let middleware = new authController();

        // =======================================================//
        // Route to fetch all networks
        // =======================================================//
        /**
         * Route to fetch all networks.
         * No authentication required.
         */
        this.router.get('/', networks.networkAll);

        // =======================================================//
        // Route to create a new network
        // =======================================================//
        /**
         * Route to create a new network.
         * Requires authentication and role validation (admin or superadmin).
         * The request payload is validated using the network schema.
         */
        this.router.post('/create', super.Validator(networkSchema.create), middleware.auth, middleware.permit(roles.admin, roles.superadmin), networks.create);
    }
}

export default new netwokRoutes().router;

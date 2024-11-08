import { Application, Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import siteController from "../controllers/site.controller";
import siteMaintenanceSchema from "../validators/site.validator";

class siteMaintenanceRoutes extends BaseController {
    router = Router();
   /**
     * Initializes the routes for managing site maintenance operations:
     * - `/` - Get the current site maintenance status.
     * - `/create` - Admin route to create new site maintenance details.
     * - `/edit` - Admin route to edit existing site maintenance details.
     * - `/change/status` - Admin route to activate or deactivate site maintenance.
     */
    constructor() {
        super()
        this.init();
    }
    /**
     * Defines the routes for site maintenance management:
     * - `/` - Get the current site maintenance status (requires authentication).
     * - `/create` - Create new site maintenance details (requires authentication and validation).
     * - `/edit` - Edit site maintenance details (requires authentication and validation).
     * - `/change/status` - Change the site maintenance status (requires authentication).
     */
    init() {

        let site = new siteController();
        let auth = new authController().auth;

        this.router.get('/', auth, site.getSiteMaintenance); 
        this.router.post('/create',auth, super.Validator(siteMaintenanceSchema.create), site.create); 
        this.router.put('/edit', auth, super.Validator(siteMaintenanceSchema.edit), site.edit);
        this.router.put('/change/status',auth, site.activeInactiveSite); 
    }
}

export default new siteMaintenanceRoutes().router;
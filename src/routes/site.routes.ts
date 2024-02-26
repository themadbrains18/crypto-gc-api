import { Application, Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import siteController from "../controllers/site.controller";
import siteMaintenanceSchema from "../validators/site.validator";

class siteMaintenanceRoutes extends BaseController {
    router = Router();

    constructor() {
        super()
        this.init();
    }

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
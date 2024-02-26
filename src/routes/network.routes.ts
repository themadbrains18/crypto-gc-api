import { Application, Router } from "express";
import authController from "../middlewares/authController";
import networkController from "../controllers/netwok.controller";
import BaseController from "../controllers/main.controller";
import networkSchema from "../validators/network.validator";
import roles from "../middlewares/_helper/roles";

class netwokRoutes extends BaseController  {
    router =  Router();

    constructor(){
        super()
        this.init();
    }

    init(){
        let networks = new networkController();
        let middleware = new authController();

          // Create a new Tutorial
        this.router.get('/',networks.networkAll);
        this.router.post('/create',super.Validator(networkSchema.create),middleware.auth,middleware.permit(roles.admin,roles.superadmin),networks.create);

    }
}

export default new netwokRoutes().router;
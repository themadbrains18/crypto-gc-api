import { Router } from "express";
import authController from "../middlewares/authController";
import addressController from "../controllers/address.controller";
import BaseController from "../controllers/main.controller";

class AddressRoutes extends BaseController {
    router = Router();

    constructor() {
        super();
        this.init();
    }

    init() {
        const address = new addressController();
        const middleware = new authController();

        // Route for creating an address
        this.router.post('/create', middleware.auth, address.create); 

        // Route for getting list of addresses with pagination
        this.router.get('/list/:offset/:limit', middleware.auth, address.userAddress);

        // Route for changing the status of an address (active/inactive)
        this.router.put('/change/status', middleware.auth, address.activeInactiveAddress);

        // Route for deleting an address
        this.router.delete('/delete/:addressid/:userid', middleware.auth, address.deleteAddress);
    }
}

export default new AddressRoutes().router;

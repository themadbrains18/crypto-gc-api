import { Application, Router } from "express";
import authController from "../middlewares/authController";
import BaseController from "../controllers/main.controller";
import convertController from "../controllers/convert.controller";

class convertRoutes extends BaseController {
  router = Router();
  constructor() {
    super();
    this.init();
  }

  init() {
    let convert = new convertController();
    let middleware = new authController();

    this.router.post("/create",middleware.auth,convert.saveConvert);
    this.router.get("/",middleware.auth,convert.getConvertList);
    this.router.get("/history",middleware.auth,convert.getConvertHistoryList);
  }
}

export default new convertRoutes().router;

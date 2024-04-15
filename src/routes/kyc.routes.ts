import { Application, Router } from "express";
import authController from "../middlewares/authController";
import kycController from "../controllers/kyc.controller";
import BaseController from "../controllers/main.controller";
import kycSchema from "../validators/kyc.validator";

import service from "../services/service";

class kycRoutes extends BaseController {
  router = Router();

  constructor() {
    super();
    this.init();
  }

  init() {
    let kyc = new kycController();
    let middleware = new authController();

    this.router.post(
      "/create",
      middleware.auth,
      super.Validator(kycSchema.create),
      kyc.create
    );
    // this.router.post("/create",service.upload.upload("../upload",['pdf','png','jpg']), super.Validator(kycSchema.create),auth, kyc.create);
    this.router.post("/institute/create", middleware.auth, kyc.institutecreate);
    this.router.get("/:id", middleware.auth, kyc.kycById);
    this.router.put(
      "/kycstatus",
      middleware.auth,
      super.Validator(kycSchema.status),
      kyc.kycStatus
    );
    this.router.get("/all/:type", kyc.kycAll);
    this.router.get("/allByLimit/:type/:offset/:limit", middleware.auth, kyc.kycAllByLimit);
  }
}

export default new kycRoutes().router;

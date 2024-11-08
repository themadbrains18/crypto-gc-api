import { Application, Router } from "express";
import authController from "../middlewares/authController";
import kycController from "../controllers/kyc.controller";
import BaseController from "../controllers/main.controller";
import kycSchema from "../validators/kyc.validator";

import service from "../services/service";

class kycRoutes extends BaseController {
  router = Router();

  /**
   * Initializes the KYC routes and sets up the necessary middleware and route handlers.
   */
  constructor() {
    super();
    this.init();
  }

  /**
   * Defines the KYC routes, including creating KYC entries, viewing KYC details, 
   * and updating KYC statuses. Also includes routes for fetching KYC data by 
   * various filters such as type, offset, and limit.
   */
  init() {
    let kyc = new kycController();
    let middleware = new authController();

    /**
     * Route to create a new KYC entry.
     * Requires authentication and validates the request payload.
     */
    this.router.post(
      "/create",
      middleware.auth,
      super.Validator(kycSchema.create),
      kyc.create
    );

    /**
     * Route to create a new KYC entry for an institute.
     * Requires authentication.
     */
    this.router.post("/institute/create", middleware.auth, kyc.institutecreate);

    /**
     * Route to fetch KYC details by ID.
     * Requires authentication.
     */
    this.router.get("/:id", middleware.auth, kyc.kycById);

    /**
     * Route to update KYC status.
     * Requires authentication and validates the request payload.
     */
    this.router.put(
      "/kycstatus",
      middleware.auth,
      super.Validator(kycSchema.status),
      kyc.kycStatus
    );

    /**
     * Route to fetch all KYC entries filtered by type.
     * No authentication required.
     */
    this.router.get("/all/:type", kyc.kycAll);

    /**
     * Route to fetch KYC entries with pagination, filtered by type.
     * Requires authentication.
     */
    this.router.get(
      "/allByLimit/:type/:offset/:limit",
      middleware.auth,
      kyc.kycAllByLimit
    );
  }
}

export default new kycRoutes().router;

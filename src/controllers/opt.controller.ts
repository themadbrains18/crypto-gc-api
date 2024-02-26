import exp from "constants";
import BaseController from "./main.controller";
import { Response, Request, NextFunction } from "express";
import { CustomError } from "../exceptions/http-exception";
import { otpSchema } from "../models/dto/otp.inerface";
import { Op } from "sequelize";
import service from "../services/service";

class otpController extends BaseController {
  protected async executeImpl(
    req: Request,
    res: Response
  ): Promise<void | any> {
    try {
      // ... Handle request by creating objects
    } catch (error: any) {
      return this.fail(res, error.toString());
    }
  }

  async match(req: Request, res: Response, next: NextFunction) {
    try {
        let otp : otpSchema = req.body
        let otpVaild  = await service.otpService.match(otp); // otp is valid then return true
        res.status(200).send(otpVaild)

    } catch (error : any) {
      next(error);
    }
  }
}

export default otpController;

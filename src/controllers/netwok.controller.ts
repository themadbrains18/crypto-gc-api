import { Response, Request, NextFunction } from "express";
import BaseController from "./main.controller";
import service from "../services/service";
import { networkInput } from "../models/model/network.model";

class networkController extends BaseController {
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

  /**
   * Get all token
   * @param req
   * @param res
   */
  async networkAll(req: Request, res: Response, next: NextFunction) {
    try {
      let networks = await service.network.all();
      super.ok<any>(res, networks);
    } catch (error) {
      next(error);
    }
  }

  /**
   * create a netwok
   * @param req
   * @param res
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      let network: networkInput = req.body;
      let result = await service.network.create(network);
      return super.ok<any>(res, {
        message: "new network successfully added.",
        result: result,
      });
    } catch (error : any) {
      super.fail(res, error.message)
    }
  }
}

export default networkController;

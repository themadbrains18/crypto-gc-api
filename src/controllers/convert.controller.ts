import { Response, Request, NextFunction } from "express";
import BaseController from "./main.controller";
import service from "../services/service";
import convertDto from "../models/dto/convert.dto";
import convertHistoryDto from "../models/dto/convertHistory.dto";

class convertController extends BaseController {
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
   * Saves a new conversion record and related history.
   * @param {Request} req - Express request object containing conversion data in body.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next function for error handling.
   */
  async saveConvert(req: Request, res: Response, next: NextFunction) {
    try {

      let bodyData: convertDto = req.body?.convert;
      bodyData.user_id = req.body?.user_id;

      let bodyHistoryData = req.body?.history;

      // create convert record and update asset of user and admin
      let response = await service.convert.create(bodyData);

      // on convert successfully create history data
      if (response.status === undefined) {
        for await (const body of bodyHistoryData) {
          let data: convertHistoryDto = body;
          data.user_id = req.body?.user_id;
          data.convert_id = response?.dataValues?.id;
          await service.convert.createhistory(data);
        }
      }
      else{
        return super.fail(res,response.message);
      }
      return super.ok<any>(res, response);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   * Retrieves a paginated list of conversion records for a user.
   * @param {Request} req - Express request object with pagination in params.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next function for error handling.
   */
  async getConvertList(req :Request, res :Response, next : NextFunction){
    try {
      let {  offset, limit } = req.params
      let responseData = await service.convert.getConvertRecord(req.body.user_id,offset, limit);

      return super.ok<any>(res,responseData);
    } catch (error:any) {
      super.fail(res,error.message)
    }
  }

  /**
   * Retrieves the full conversion history for a user.
   * @param {Request} req - Express request object with user ID in body.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next function for error handling.
   */
  async getConvertHistoryList(req: Request, res : Response, next :NextFunction){
    try {
      let responseData = await service.convert.getConvertHistory(req.body.user_id);

      return super.ok<any>(res,responseData);
    } catch (error:any) {
      super.fail(res,error.message)
    }
  }

  /**
   * Retrieves a paginated conversion history list for a user.
   * @param {Request} req - Express request object with pagination in params and user ID in body.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next function for error handling.
   */
  async getConvertHistoryListByLimit(req: Request, res : Response, next :NextFunction){
    try {
      let {  offset, limit } = req.params
      let responseData = await service.convert.getConvertHistoryByLimit(req.body.user_id,offset, limit);

      return super.ok<any>(res,responseData);
    } catch (error:any) {
      super.fail(res,error.message)
    }
  }

}

export default convertController;
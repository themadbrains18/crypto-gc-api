import { Response, Request } from "express";
import BaseController from "./main.controller";
import service from "../services/service";
import { tokensModel, userModel } from "../models";
import { string } from "joi";

class depositController extends BaseController {
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
   * 
   * @param res 
   * @param req 
   */
  BaseController(req: Request, res: Response): void {


  }

  /**
* Sleeps for a given time in milliseconds.
* @param {number} ms - Time in milliseconds to sleep.
* @returns {Promise<void>}
*/
  sleep = (ms: any) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 
   * @param res 
   * @param req 
   */
  saveTransaction(req: Request, res: Response): void {

  }


  /**
   * 
   * @param res 
   * @param req 
   */
  saveTRXTransaction(req: Request, res: Response): void {

  }


  /**
   * 
   * @param res 
   * @param req 
   */
  saveTRC20Transaction(req: Request, res: Response): void {

  }


  /**
   * Fetches deposit details by ID.
   * @param {Request} req - Express request object with deposit ID in params.
   * @param {Response} res - Express response object.
   */
  async getdepositDetails(req: Request, res: Response) {
    try {
      let depositResponse = await service.depositServices.getDepositListById(req?.params?.id);
      super.ok<any>(res, depositResponse);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
* Fetches deposit history by user ID.
* @param {Request} req - Express request object with user ID in params.
* @param {Response} res - Express response object.
*/
  async getdepositHistory(req: Request, res: Response) {
    try {
      let depositResponse = await service.depositServices.getDepositHistoryById(req?.params?.id);
      super.ok<any>(res, depositResponse);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
* Fetches paginated deposit history by user ID, with optional filters.
* @param {Request} req - Express request object with user ID and pagination parameters.
* @param {Response} res - Express response object.
*/
  async getdepositHistoryByLimit(req: Request, res: Response) {
    try {
      let { offset, limit, currency, date } = req?.params

      let depositResponsePaginate: any = await service.depositServices.getDepositHistoryByIdAndLimit(req?.params?.id, offset, limit, currency, date);
      super.ok<any>(res, { data: depositResponsePaginate.data, total: depositResponsePaginate.total, totalAmount: depositResponsePaginate.totalAmount });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   * Retrieves the complete deposit list for admin.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   */
  async depositList(req: Request, res: Response) {

    try {
      let depositResponse = await service.depositServices.getDepositList();
      super.ok<any>(res, depositResponse);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
  /**
   * Retrieves a paginated list of deposits for admin with pagination.
   * @param {Request} req - Express request object with pagination parameters.
   * @param {Response} res - Express response object.
   */
  async depositListByLimit(req: Request, res: Response) {

    try {
      let { offset, limit } = req.params;
      let depositResponse = await service.depositServices.getDepositList();
      let depositResponsePaginate = await service.depositServices.getDepositListByLimit(offset, limit);
      super.ok<any>(res, { data: depositResponsePaginate, total: depositResponse?.length });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
}

export default depositController;
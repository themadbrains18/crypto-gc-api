import { Response , Request } from "express";
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
    BaseController (req : Request, res : Response) : void{


    }

  sleep = (ms:any) => {
    return new Promise(resolve => setTimeout(resolve, ms));
   }

    /**
     * 
     * @param res 
     * @param req 
     */
    saveTransaction (req : Request, res : Response) : void{

    }
    
    
    /**
     * 
     * @param res 
     * @param req 
     */
    saveTRXTransaction (req : Request, res : Response) : void{

    }
    
    
    /**
     * 
     * @param res 
     * @param req 
     */
     saveTRC20Transaction (req : Request, res : Response) :void{
   
    }
    
    
    /**
     * 
     * @param res 
     * @param req 
     */
    async getdepositDetails (req : Request, res : Response){
      try {
        let depositResponse = await service.depositServices.getDepositListById(req?.params?.id);
        super.ok<any>(res, depositResponse);
      } catch (error: any) {
        super.fail(res, error.message);
      }
    }    

    async getdepositHistory(req : Request, res : Response){
      try {
        let depositResponse = await service.depositServices.getDepositHistoryById(req?.params?.id);
        super.ok<any>(res, depositResponse);
      } catch (error: any) {
        super.fail(res, error.message);
      }
    }    
    async getdepositHistoryByLimit(req : Request, res : Response){
      try {
        let {offset,limit} = req?.params
        let depositResponse = await service.depositServices.getDepositHistoryById(req?.params?.id);
        let depositResponsePaginate:any = await service.depositServices.getDepositHistoryByIdAndLimit(req?.params?.id,offset,limit);
        super.ok<any>(res, {data:depositResponsePaginate.data, total:depositResponse.length,  totalAmount:depositResponsePaginate.totalAmount});
      } catch (error: any) {
        super.fail(res, error.message);
      }
    }    

    /**
   * admin depositList 
   * @param req
   * @param res
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
   * admin depositListByLimit 
   * @param req
   * @param res
   */
  async depositListByLimit(req: Request, res: Response) {
   
    try {
      let {offset,limit} = req.params;
      let depositResponse = await service.depositServices.getDepositList();
      let depositResponsePaginate = await service.depositServices.getDepositListByLimit(offset,limit);
      super.ok<any>(res, { data: depositResponsePaginate, total: depositResponse?.length });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
}

export default depositController;
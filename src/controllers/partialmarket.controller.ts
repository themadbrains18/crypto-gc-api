import { Response, Request } from "express";
import BaseController from "./main.controller";

class partialMarketController extends BaseController{
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
     * @param req 
     * @param res 
     */
    socketMarketBuySell(req : Request, res : Response){

    }

    /**
     * 
     * @param req 
     * @param res 
     */
    restateQueue(req : Request, res : Response){

    }
}
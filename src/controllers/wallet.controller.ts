import { Request, Response, NextFunction } from "express";
import BaseController from "./main.controller";
import { CustomError } from "../exceptions/http-exception";
import service from "../services/service";
import { tokenInput } from "../models/model/tokens.model";
import tokenDto from "../models/dto/token.dto";
import { any } from "joi";

class walletController extends BaseController {
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
     *  /Users/baljeetsingh/dumps/Dump20230728
     * @param res
     * @param req
     */

    async getWalletAddressByuserIdAndNetwork(req: Request, res: Response) {
        try {

            let walletData = await service.userWalletServices.all(req.params.user_id, req.params.network);

            super.ok<any>(res, walletData);
        } catch (error:any) {
            super.fail(res,error.message);
        }

    }
}

export default walletController;

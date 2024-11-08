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
   * Retrieves wallet address for a user based on user ID and network.
   * 
   * @param {Request} req - The request object containing `user_id` and `network` parameters.
   * @param {Response} res - The response object to send the wallet data.
   * @returns {Promise<void>} - Sends the wallet address data for the user.
   * @throws {CustomError} - Throws an error if the wallet data retrieval fails.
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

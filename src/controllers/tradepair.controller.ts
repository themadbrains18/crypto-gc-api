import { Request, Response, NextFunction } from "express";
import BaseController from "./main.controller";
import { CustomError } from "../exceptions/http-exception";
import service from "../services/service";
import { tokenInput } from "../models/model/tokens.model";
import tokenDto from "../models/dto/token.dto";
import { updatePairStatus } from "../utils/interface";
import tradePairDto from "../models/dto/tradePair.dto";
import { tradePairModel } from "../models";

class tradePairController extends BaseController {
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
   * @description Retrieves all trade pairs.
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next function to call if an error occurs.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async allPairs(req: Request, res: Response, next: NextFunction) {
    try {
      let pairs = await service.pairServices.all();

      super.ok<any>(res, pairs);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * @description Retrieves a paginated list of trade pairs.
   * @param req - The request object containing offset and limit as parameters.
   * @param res - The response object.
   * @param next - The next function to call if an error occurs.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async allPairsByLimit(req: Request, res: Response, next: NextFunction) {
    try {
      let { offset, limit } = req.params;
      let pairs = await service.pairServices.all();
      let pairsPaginate = await service.pairServices.allByLimit(offset, limit);
      super.ok<any>(res, { data: pairsPaginate, total: pairs?.length });
    } catch (error: any) {
      next(error);
    }
  }


  /**
   * @description Placeholder method for socket communication to get a list of coins.
   * @param req - The request object.
   * @param res - The response object.
   * @returns {void}
   */ 
  socketGetCoinList(req: Request, res: Response) {}


  /**
   * @description Creates a new trade pair.
   * @param req - The request object containing the trade pair data.
   * @param res - The response object.
   * @param next - The next function to call if an error occurs.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      let trade: tradePairDto = req.body;
      // token.status = 'false';
      //=======================================//
      // check token if already register
      //=======================================//
      //   let tokenConntractAlreadyRegister = await service.token.alreadyExist(trade)
      //   let flag = false;

      //   if (tokenConntractAlreadyRegister.length > 0) {
      //     return super.fail(res, "Token contarct already registered.");
      //   }

      let tradePairExist = await tradePairModel.findOne({
        where: { tokenOne: trade?.tokenOne, tokenTwo: trade?.tokenTwo },
        raw: true,
      });
      if (tradePairExist) {
        return super.ok<any>(res, {
          message: "Pair already available",
          result: tradePairExist,
          status: 409,
        });
      }
      let pairResponse = await service.pairServices.create(trade);
      super.ok<any>(res, {
        message: "Trade Pair successfully registered.",
        result: pairResponse,
        status: 200,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // ===================================================================
  // Admin service api
  // ===================================================================


  /**
   * @description Activates or deactivates a trade pair.
   * @param req - The request object containing the pair id and status.
   * @param res - The response object.
   * @param next - The next function to call if an error occurs.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async activeInactivePair(req: Request, res: Response, next: NextFunction) {
    try {
      let { id, status } = req.body;

      let data: updatePairStatus = { id, status };

      let statusResponse = await service.pairServices.changeStatus(data);
      if (statusResponse) {
        let trades = await service.pairServices.all();
        return super.ok<any>(res, trades);
      } else {
        super.fail(res, statusResponse);
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
  /**
   * @description Edits an existing trade pair.
   * @param req - The request object containing the trade pair data.
   * @param res - The response object.
   * @param next - The next function to call if an error occurs.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      let trade: tradePairDto = req.body;

      //=======================================//
      // check token if already register
      //=======================================//
      let tradePairAlreadyRegister = await service.pairServices.alreadyExist(
        trade
      );

      if (tradePairAlreadyRegister) {
        let tradeResponse = await service.pairServices.edit(trade);
        if (tradeResponse) {
          let trades = await service.pairServices.all();
          return super.ok<any>(res, { trades, status: 200 });
        }
        // super.ok<any>(res, { message: "Token successfully registered.", data: tokenResponse })
      } else {
        return super.fail(
          res,
          "Trade pair not registered. Please add new token."
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default tradePairController;

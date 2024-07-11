import { Request, Response, NextFunction } from "express";
import BaseController from "./main.controller";
import service from "../services/service";
import { updateFuturePairStatus } from "../utils/interface";
import { futureTradePairModel } from "../models";
import futureTradePairDto from "../models/dto/futurePair.dto";

class futureTradePairController extends BaseController {
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

  async allPairs(req: Request, res: Response, next: NextFunction) {
    try {
      let pairs = await service.future.all(req?.params?.name);

      super.ok<any>(res, pairs);
    } catch (error: any) {
      next(error);
    }
  }

  async allPairsByLimit(req: Request, res: Response, next: NextFunction) {
    try {
      let { offset, limit } = req.params;
      let pairs = await service.future.all('all');
      let pairsPaginate = await service.future.allByLimit(offset, limit);
      super.ok<any>(res, { data: pairsPaginate, total: pairs?.length });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   *
   * @param res
   * @param req
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      let trade: futureTradePairDto = req.body;
      
      let tradePairExist = await futureTradePairModel.findOne({
        where: { coin_id: trade?.coin_id, usdt_id: trade?.usdt_id },
        raw: true,
      });
      if (tradePairExist) {
        return super.ok<any>(res, {
          message: "Pair already available",
          result: tradePairExist,
          status: 409,
        });
      }
      let pairResponse = await service.future.create(trade);
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
   *
   * @param res
   * @param req
   */
  async activeInactivePair(req: Request, res: Response, next: NextFunction) {
    try {
      let { id, status } = req.body;

      let data: updateFuturePairStatus = { id, status };

      let statusResponse = await service.future.changeStatus(data);
      if (statusResponse) {
        let trades = await service.future.all('all');
        return super.ok<any>(res, trades);
      } else {
        super.fail(res, statusResponse);
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      let trade: futureTradePairDto = req.body;

      //=======================================//
      // check token if already register
      //=======================================//
      let tradePairAlreadyRegister = await service.future.alreadyExist(
        trade
      );

      if (tradePairAlreadyRegister) {
        let tradeResponse = await service.future.edit(trade);
        if (tradeResponse) {
          let trades = await service.future.all('all');
          return super.ok<any>(res, { trades, status: 200 });
        }
        // super.ok<any>(res, { message: "Token successfully registered.", data: tokenResponse })
      } else {
        return super.fail(
          res,
          "Trade pair not registered. Please create new pair."
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default futureTradePairController;

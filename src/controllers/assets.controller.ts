import { NextFunction, Request, Response } from "express";
import BaseController from "./main.controller";
import service from "../services/service";
import assetsDto from "../models/dto/assets.dto";

class assetsController extends BaseController {


  protected async executeImpl(req: Request, res: Response): Promise<void | any> {
    try {
      // ... Handle request by creating objects

    } catch (err: any) {
      return this.fail(res, err.toString())
    }
  }

  /**
   * get user assets list here
   * @param req
   * @param res
   */
  async assetsList(req: Request, res: Response) {
    try {
      let assetResponse = await service.assets.getAssetsList();

      super.ok<any>(res, assetResponse);
    } catch (error) {

    }
  }
  /**
   * get user assets list here by limit
   * @param req
   * @param res
   */
  async assetsListByLimit(req: Request, res: Response) {
    try {
      let { offset, limit } = req?.params
      let assetResponse = await service.assets.getAssetsList();
      let assetResponsePaginate = await service.assets.getAssetsListByLimit(offset, limit);

      super.ok<any>(res, { data: assetResponsePaginate, total: assetResponse?.length });
    } catch (error) {

    }
  }

  /**
   * new entry for assets and update
   * @param req 
   * @param res 
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {

      let asset: assetsDto = req.body;

      let assetResponse = await service.assets.create(asset);

      super.ok<any>(res, { message: 'Assets added successfully!', result: assetResponse });
    } catch (error) {
      next(error);
    }
  }

  /**
   * get user assets list here
   * @param req
   * @param res
   */
  async walletTowalletTranserfer(req: Request, res: Response, next: NextFunction) {
    try {
      let assetResponse = await service.assets.walletTowalletTranserfer(req.body);

      if (assetResponse.hasOwnProperty('status') && assetResponse.status !== 200) {
        return super.fail(res, assetResponse.message === "" ? assetResponse.additionalInfo : assetResponse.message);
      }

      super.ok<any>(res, { message: 'Assets wallet to wallet transfer successfully!', result: assetResponse });

    } catch (error) {
      next(error);
    }

  }

  /**
   * get user assets list here
   * @param req
   * @param res
   */
  async assetsOverview(req: Request, res: Response, next: NextFunction) {
    try {
      let assetResponse = await service.assets.assetsOverview(req.params.userid);
      super.ok<any>(res, assetResponse);

    } catch (error) {
      next(error);
    }
  }
  /**
   * get user assets list here by limit
   * @param req
   * @param res
   */
  async assetsOverviewByLimit(req: Request, res: Response, next: NextFunction) {
    try {
      let { offset, limit } = req.params
      let assetResponse = await service.assets.assetsOverview(req.params.userid);
      let assetPaginate = await service.assets.assetsOverviewByLimit(req.params.userid, offset, limit);
      super.ok<any>(res, { data: assetPaginate?.data, total: assetResponse.length, totalAmount: assetPaginate?.totalAmount });

    } catch (error) {
      next(error);
    }
  }
  /**
   * get user assets list here by type
   * @param req
   * @param res
   */
  async assetsOverviewByType(req: Request, res: Response, next: NextFunction) {
    try {
      let {type, offset, limit } = req.params
      let assetPaginate = await service.assets.assetsOverviewByType(req.body.user_id,type, offset, limit);
      super.ok<any>(res, assetPaginate);

    } catch (error) {
      next(error);
    }
  }

  /**
   * get user assets list here
   * @param req
   * @param res
   */
  async transferHistory(req: Request, res: Response) {
    try {
      let transferResponse = await service.assets.transferHistory(req.params.userid);
      super.ok<any>(res, transferResponse);
    } catch (error) {

    }
  }

}

export default assetsController;

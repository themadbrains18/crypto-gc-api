import { NextFunction, Request, Response } from "express";
import BaseController from "./main.controller";
import service from "../services/service";
import assetsDto from "../models/dto/assets.dto";

class assetsController extends BaseController {

 /**
   * Executes the base implementation with error handling.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @returns {Promise<void | any>}
   */
  protected async executeImpl(req: Request, res: Response): Promise<void | any> {
    try {
      // ... Handle request by creating objects

    } catch (err: any) {
      return this.fail(res, err.toString())
    }
  }

  /**
   * Retrieves the list of all assets.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   */
  async assetsList(req: Request, res: Response) {
    try {
      let assetResponse = await service.assets.getAssetsList();

      super.ok<any>(res, assetResponse);
    } catch (error) {

    }
  }
  /**
   * Retrieves a paginated list of assets based on the offset and limit parameters.
   * @param {Request} req - Express request object with offset and limit in params.
   * @param {Response} res - Express response object.
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
   * Creates or updates an asset entry based on request data.
   * @param {Request} req - Express request object containing asset data in body.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
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
   * Transfers assets between wallets and returns a success or failure message.
   * @param {Request} req - Express request object containing transfer details in body.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   */
  async walletTowalletTranserfer(req: Request, res: Response, next: NextFunction) {
    try {
      let assetResponse = await service.assets.walletTowalletTranserfer(req.body);

      if (assetResponse.hasOwnProperty('status') && assetResponse.status !== 200) {
        return super.fail(res, assetResponse.message === "" ? assetResponse.additionalInfo : assetResponse.message);
      }

      const fromWallet = req.body.from === 'main_wallet' ? 'Spot Wallet' : 'Future Wallet';
      const toWallet = req.body.to === 'main_wallet' ? 'Spot Wallet' : 'Future Wallet';
  
  
      super.ok<any>(res, { message: `Assets transferred successfully from ${fromWallet} to ${toWallet}!`, result: assetResponse });
  

    } catch (error) {
      next(error);
    }

  }
  /**
   * Provides an overview of the assets for a specific user.
   * @param {Request} req - Express request object with user ID in params.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
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
   * Provides a paginated overview of the assets for a specific user based on offset and limit.
   * @param {Request} req - Express request object with offset and limit in params.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
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
   * Provides a filtered overview of assets by type.
   * @param {Request} req - Express request object containing user ID and asset type in params.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
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
   * Retrieves the transfer history of assets for a specific user.
   * @param {Request} req - Express request object with user ID in params.
   * @param {Response} res - Express response object.
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

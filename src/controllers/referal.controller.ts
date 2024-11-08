import { NextFunction, Request, Response } from "express";
import BaseController from "./main.controller";
import service from "../services/service";
import { assetModel, depositModel, globalTokensModel, marketOrderModel, referProgramInviteModel, referUserModel, tokensModel, userModel } from "../models";

class ReferalController extends BaseController {
  protected async executeImpl(
    req: Request,
    res: Response
  ): Promise<void | any> {
    try {
      // ... Handle request by creating objects
    } catch (error: any) {
      return super.fail(res, error.toString());
    }
  }

  /**
   * Fetches the referral list of a user.
   * @param req - The request object containing user ID in params.
   * @param res - The response object.
   * @param next - The next middleware function.
   */  
  async getUserReferalList(req: Request, res: Response, next: NextFunction) {
    try {
      let user = await referUserModel.findAll({
        where: { referral_user: req.params.userid },
        include: [
          {
            model: userModel,
            attributes: {
              exclude: [
                "deletedAt",
                "cronStatus",
                "createdAt",
                "updatedAt",
                "UID",
                "antiphishing",
                "registerType",
                "statusType",
                "tradingPassword",
                "kycstatus",
                "password", "otpToken", "own_code", "pin_code", "secret", "TwoFA"
              ],
            },
            include: [{ model: depositModel }, { model: marketOrderModel }]
          },
          { model: referProgramInviteModel }
        ]
      });

      return super.ok<any>(res, user);

    } catch (error: any) {
      return super.fail(res, error.message);
    }
  }
    /**
   * Fetches the referral list with pagination.
   * @param req - The request object containing user ID, offset, and limit in params.
   * @param res - The response object.
   * @param next - The next middleware function.
   */
  async getUserReferalListByLimit(req: Request, res: Response, next: NextFunction) {
    try {
      let { offset, limit } = req?.params
      let user = await userModel.findOne({
        where: { id: req.params.userid },
        raw: true,
      });
      if (user) {
        let referUser = await service.referalService.getReferalByreferCode(
          user?.own_code
        );
        let referUserList = await service.referalService.getReferalByreferCodeByLimit(
          user?.own_code, offset, limit
        );

        return super.ok<any>(res, { data: referUserList, total: referUser?.length });
      } else {
        return super.fail(res, "user not found");
      }
    } catch (error: any) {
      return super.fail(res, error.message);
    }
  }
  /**
   * Fetches user rewards details.
   * @param req - The request object containing the user ID in params.
   * @param res - The response object.
   * @param next - The next middleware function.
   */
  async getUserRewards(req: Request, res: Response, next: NextFunction) {
    try {
      let response = await service.referalService.getUserRewards(req.params.userid);
      if (response) {
        super.ok<any>(res, response);
      }
    } catch (error: any) {
      return super.fail(res, error.message);
    }
  }
  /**
   * Creates new user rewards.
   * @param req - The request object containing reward data in body.
   * @param res - The response object.
   * @param next - The next middleware function.
   */
  async createUserRewards(req: Request, res: Response, next: NextFunction) {
    try {
      let response = await service.referalService.createUserRewards(req.body);
      if (response) {
        super.ok<any>(res, response);
      }
    } catch (error: any) {
      return super.fail(res, error.message);
    }
  }
  /**
   * Updates existing user rewards.
   * @param req - The request object containing updated reward data in body.
   * @param res - The response object.
   * @param next - The next middleware function.
   */
  async updateUserRewards(req: Request, res: Response, next: NextFunction) {
    try {
      let response = await service.referalService.updateUserRewards(req.body);
      if (response) {
        super.ok<any>(res, response);
      }
    } catch (error: any) {
      return super.fail(res, error.message);
    }
  }
  /**
   * Fetches reward details by user ID and reward ID.
   * @param req - The request object containing user ID and reward ID in params.
   * @param res - The response object.
   * @param next - The next middleware function.
   */
  async getRewardsDetailById(req: Request, res: Response, next: NextFunction) {
    try {

      let response = await service.referalService.getRewardsDetailById(req.params.userid, req.params.rewardid);
      if (response) {
        super.ok<any>(res, response);
      }
    } catch (error: any) {
      return super.fail(res, error.message);
    }
  }


}

export default ReferalController;

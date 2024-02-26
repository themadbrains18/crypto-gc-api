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

import { UserInput, UserOuput } from "../model/users.model";
import sequelize, { assetModel, depositModel, globalTokensModel, lastLoginModel, marketOrderModel, orderModel, referProgramInviteModel, referUserModel, tokensModel, userModel, userRewardModel, userRewardTotalModel, walletsModel, withdrawModel } from "../index";
import { Op } from "sequelize";
import { lastLoginOuput } from "../model/lastLogin.model";
import MarketProfitModel, { MarketProfitOuput } from "../model/marketProfit.model";
import service from "../../services/service";

interface logins {
  number?: string;
  email?: string;
  password: string;
}

// interface MarketProfitOuput {
//   totalProfit: number;
//   coin_type: string;
//   totalFees: number;
//   totalFeesInUsdt: number;
// }

class userDal {
  create = async (payload: UserInput): Promise<object> => {
    try {
      const users = (await userModel.create(payload)).get({ plain: true });
      if (users) {
        let referUser = await userModel.findOne({ where: { own_code: users.refeer_code }, raw: true });
        if (referUser) {
          let programEVent = await referProgramInviteModel.findOne({ where: { referral_id: payload?.referral_id }, raw: true });
          let obj = {
            user_id: users?.id,
            referral_user: referUser?.id,
            event_id: programEVent?.id
          }
          await referUserModel.create(obj);

          // create entry for welcome rewards
          let welcomeObj = {
            user_id: users?.id,
            type: 'Coupon',
            amount: 10,
            description: 'Welcome Gift',
            coupan_code: await service.otpGenerate.referalCodeGenerate()
          }

          await userRewardModel.create(welcomeObj);

        }
      }
      return users;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  userAlreadyExist = async (id: number | string): Promise<object | null> => {
    try {
      const user = await userModel.findOne({
        where: {
          [Op.or]: [{ number: id }, { email: id }],
        },
      });
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  checkUserReferCodeExist = async (refer: string): Promise<object | null> => {
    try {
      const user = await userModel.findOne({
        where: {
          own_code: refer
        },
      });
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  login = async (payload: UserInput): Promise<any> => {

    let condition = {};
    let number = (payload.number === "string") ? "" : payload.number;
    let email = (payload.email === "string") ? "" : payload.email;

    if (number !== "" && email !== "") {
      condition = { number: number, email: email };
    } else if (email !== "") {
      condition = { email: email };
    } else if (number !== "") {
      condition = { number: number };
    }
    interface login {
      number: string;
      email: string;
      password: string;
    }
    let users: login | null = await userModel.findOne({
      where: condition,
      attributes: {
        exclude: [
          "deletedAt",
          "cronStatus",
          "createdAt",
          "UID",
          "antiphishing",
          "registerType",
          "statusType",
          "tradingPassword",
          "kycstatus",
        ],
      },
      raw: true,
    });

    return users;
  };

  checkUserByPk = async (id: string): Promise<UserOuput | any> => {
    const user = await userModel.findOne({
      where: { id: id },
      raw: true
    });
    return user;
  }

  async getListOfUser(): Promise<UserOuput[]> {
    try {

      return await userModel.findAll({
        include:
        {
          model: walletsModel,
        }
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getListOfUserByLimit(offset: any, limit: any): Promise<UserOuput[]> {
    try {
      let offsets = parseInt(offset);
      let limits = parseInt(limit);
      return await userModel.findAll({
        include:
        {
          model: walletsModel,
        },
        limit: limits,
        offset: offsets,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getListOfAdminProfit(): Promise<MarketProfitOuput[]> {
    try {
      return await MarketProfitModel.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('profit')), 'profit'],
          'coin_type',
          [sequelize.fn('SUM', sequelize.col('fees')), 'fees'],
          [sequelize.fn('SUM', sequelize.col('listing_fee')), 'listing_fee'],

        ],
        group: ['coin_type'],
        raw: true
      })

    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getListOfUserActivity(): Promise<lastLoginOuput[]> {
    try {
      return await lastLoginModel.findAll({ raw: true });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getListOfUserActivityByLimit(offset: string, limit: string): Promise<lastLoginOuput[]> {
    try {
      let offsets = parseInt(offset)
      let limits = parseInt(limit)
      return await lastLoginModel.findAll({
        limit: limits,
        offset: offsets
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getListOfUserActivityByIdLimit(userid: string, offset: string, limit: string): Promise<lastLoginOuput[]> {
    try {
      let offsets = parseInt(offset)
      let limits = parseInt(limit)
      return await lastLoginModel.findAll({
        where: { user_id: userid },
        limit: limits,
        offset: offsets
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async clearAllUserActivity(user_id: string): Promise<any> {
    try {
      let response = await lastLoginModel.destroy({ where: { user_id: user_id } });
      return true;

    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getUserDetailAllActivity(user_id: string): Promise<UserOuput | any> {
    try {
      return await userModel.findOne({
        where: { id: user_id },
        attributes: {
          exclude: [
            "password",
            "deletedAt",
            "cronStatus",
            "updatedAt",
            "createdAt",
            "createdAt",
            "UID",
            "antiphishing",
            "registerType",
            "statusType",
            "tradingPassword",
            "kycstatus",
            "TwoFA",
            "otpToken", "own_code",
            "refeer_code", "secret"
          ],
        },
        include: [
          { model: assetModel, include: [{ model: tokensModel }, { model: globalTokensModel }] },
          { model: withdrawModel, include: [{ model: tokensModel }, { model: globalTokensModel }] },
          { model: depositModel },
          { model: marketOrderModel, include: [{ model: tokensModel }, { model: globalTokensModel }] },
          { model: orderModel, include: [{ model: tokensModel }, { model: globalTokensModel }] },
          { model: lastLoginModel },
        ]
      })
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default userDal;

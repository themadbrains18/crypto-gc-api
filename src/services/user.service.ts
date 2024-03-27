import { error } from "console";
import userDal from "../models/dal/users.dal";
import { loginUser } from "../models/dto/user.interface";
import userModel, { UserInput, UserOuput } from "../models/model/users.model";
import service from "./service";
import { antiPhishingCode, googleAuth, updateFundcode, updatepassword, updateUserPin, updateUserStatus, updateWhiteList } from "../utils/interface";
import speakeasy from "speakeasy";
import sequelize from "../models/model/users.model";
import { lastLoginOuput } from "../models/model/lastLogin.model";
import { MarketProfitOuput } from "../models/model/marketProfit.model";
import { raw } from "body-parser";


let userDataLayer = new userDal();

class userServices {
  user: any;

  /**
   * user register
   * @param payload 
   * @returns 
   */
  create(payload: UserInput): Promise<UserOuput | object> {
    return userDataLayer.create(payload);
  }

  /**
   * check user already exist in DB
   * @param id 
   * @returns 
   */
  async checkIfUserExsit(id: number | string): Promise<object | null> {
    return await userDataLayer.userAlreadyExist(id);
  }

  async checkUserReferCodeExist(refer :string):Promise<object | null>{
    return await userDataLayer.checkUserReferCodeExist(refer);
  }

  /**
   * User Login process
   * @param payload 
   * @returns 
   */
  async login(payload: UserInput): Promise<any> {
    let user = await userDataLayer.login(payload);

    if (user == null) {
      return {
        success: false,
        message: "Opps! please check your credentials 1",
      };
    }

    let pass = service.bcypt.MDB_compareHash(
      `${payload.password}`,
      user.password
    );

    if (pass) {
      return { success: true, data: user };
    } else {
      return {
        success: false,
        message: "Opps! please check your credentials 1",
      };
    }
  }

  /**
   * Set google 2FA Authentication
   * @param payload 
   * @returns 
   */
  async googleAuth(payload: googleAuth): Promise<any> {
    try {
      // ======================================================
      // verify google 2FA code 
      // ======================================================

      const { secret, token, otp } = payload;
      if (secret && token) {
        const isVerified = speakeasy?.totp.verify({
          secret: secret,
          encoding: "base32",
          token: token,
        });

        if (isVerified) {
          let user: UserInput = payload;

          (user.TwoFA = payload?.TwoFA),
            (user.password = payload?.password),
            (user.id = payload?.user_id);

          let result = await this.updateUser(user);
        }

        return isVerified;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Update user
   * @param payload 
   * @returns 
   */
  async updateUser(payload: UserInput): Promise<UserOuput | any> {
    try {
      let user = await userModel.findOne({
        where: { id: payload.id },
        raw: true,
      });
      if (user) {
        let pass = service.bcypt.MDB_compareHash(
          `${payload.password}`,
          user.password
        );

        if (pass) {
          await delete payload?.password;
          await delete payload?.secret;
          // console.log(payload);
          let res = await userModel.update(payload, {
            where: { id: payload.id },
          });
          // console.log(res[0]);
          return true;
        } else {
          return {
            success: false,
            message: "Opps! please check your password",
          };
        }
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * confirm user fund code matched or not
   * @param payload 
   * @returns 
   */
  async confirmFundcode(payload: updateFundcode): Promise<boolean> {
    try {
      let user = await userModel.findOne({ where: { id: payload.user_id } });
      let data = user?.dataValues;
      if (data) {
        if (data.tradingPassword?.toString() !== payload.old_password) {
          throw new Error("Trading password not matched. Please try agaim.");
        }
        return true;
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * update user fund code
   * @param payload 
   * @returns 
   */
  async updateFundcode(payload: updateFundcode): Promise<UserOuput | any> {
    try {
      let user = await userModel.findOne({ where: { id: payload.user_id } });
      if (user) {
        if (
          user.dataValues?.tradingPassword !== "" &&
          user.dataValues?.tradingPassword !== null &&
          user.dataValues?.tradingPassword !== undefined
        ) {
          let isMatched = await this.confirmFundcode(payload);
          if (isMatched == true) {
            return await user.update({ tradingPassword: payload.new_password });
          }
        } else {
          return await user.update({ tradingPassword: payload.new_password });
        }
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  /**
   * update user  whitelist status
   * @param payload 
   * @returns 
   */
  async updateWhiteList(payload: updateWhiteList): Promise<UserOuput | any> {
    try {
      let user = await userModel.findOne({ where: { id: payload.user_id } });
      if (user) {
            return await user.update({ whitelist: payload.whitelist });
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * confirm user password matched or not
   * @param payload 
   * @returns 
   */
  async confirmPassword(payload: updatepassword): Promise<boolean> {
    try {
      let user = await userModel.findOne({ where: { id: payload.user_id } });
      let data = user?.dataValues;

      let pass = service.bcypt.MDB_compareHash(
        `${payload.old_password}`,
        data?.password
      );

      if (pass) {
        return true;
      } else {
        return false;
        throw new Error("Old Password not matched. Please try agaim.");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Check user trading password matched or not
   * @param payload 
   * @returns 
   */
  async confirmTradingPassword(payload: updatepassword): Promise<boolean> {
    try {
      let user = await userModel.findOne({ where: { id: payload.user_id }, raw : true });
      let data = user;

      let pass = service.bcypt.MDB_compareHash(
        `${payload.old_password}`,
        data?.tradingPassword
      );

      if(pass){
        return true
      }
      else {
        return false;
        throw new Error("Old Password not matched. Please try agaim.");
      }
      // if (data?.tradingPassword === payload.old_password) {
      //   return true;
      // } else {
      //   return false;
      //   throw new Error("Old Password not matched. Please try agaim.");
      // }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Update user account password
   * @param payload 
   * @returns 
   */
  async updatePassword(payload: updatepassword): Promise<UserOuput | any> {
    try {
      let user = await userModel.findOne({ where: { id: payload.user_id } });
      if (user) {
        let password = await service.bcypt.MDB_crateHash(payload?.new_password);

        return await user.update({ password: password, pwdupdatedAt : new Date(new Date().getTime() + 60 * 60 * 24 * 1000) });
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * set user trading password
   * @param payload 
   * @returns 
   */
  async tradingPassword(payload: updatepassword): Promise<UserOuput | any> {
    try {
      let user = await userModel.findOne({ where: { id: payload.user_id } });
      if (user) {
        return await user.update({ tradingPassword: payload.new_password });
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  /**
   * set user Ntiphishing cde
   * @param payload 
   * @returns 
   */
  async antiPhishingCode(payload: antiPhishingCode): Promise<UserOuput | any> {
    try {
      let user = await userModel.findOne({ where: { id: payload.user_id } });
      if (user) {
        return await user.update({ antiphishing: payload.antiphishing });
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Get users Lsit
   * @returns 
   */
  async getUsersList(): Promise<UserOuput[]> {
    return userDataLayer.getListOfUser();
  }

  /**
   * Admin user list by offset and limit per page
   * @param offset 
   * @param limit 
   * @returns 
   */
  async getUsersListByLimit(offset:any,limit:any): Promise<UserOuput[]> {
    return userDataLayer.getListOfUserByLimit(offset,limit);
  }

  /**
   * Get Admin profit list
   * @returns 
   */
  async getAdminProfitList(): Promise<MarketProfitOuput[]> {
    return userDataLayer.getListOfAdminProfit();
  }

  /**
   * Get user activity list
   * @returns 
   */
  async getUsersActivityList(): Promise<lastLoginOuput[]> {
    return userDataLayer.getListOfUserActivity();
  }

  /**
   * Get users activity list by offset and limit per page
   * @param offset 
   * @param limit 
   * @returns 
   */
  async getUsersActivityListByLimit(offset:string,limit:string): Promise<lastLoginOuput[]> {
    return userDataLayer.getListOfUserActivityByLimit(offset,limit);
  }

  /**
   * Get single user activity list by offset and limit per page
   * @param userid 
   * @param offset 
   * @param limit 
   * @returns 
   */
  async getUsersActivityListByIdLimit(userid:string,offset:string,limit:string): Promise<lastLoginOuput[]> {
    return userDataLayer.getListOfUserActivityByIdLimit(userid,offset,limit);
  }

  /**
   * Update user status block unblock
   * @param payload 
   * @returns 
   */
  async updateUserStatus(payload: updateUserStatus): Promise<UserOuput | any> {
    try {

      let user = await userModel.findOne({ where: { id: payload.id } });
      if (user) {
        return await user.update({ statusType: payload.statusType });
      }
      else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  /**
   *  update user pin for security 
   * @param payload 
   * @returns 
   */
  async updateUserPin(payload: updateUserPin): Promise<UserOuput | any> {
    try {
      let user = await userModel.findOne({ where: { id: payload.id } });
      if (user) {
        return await user.update({ pin_code: payload.pin_code });
      }
      else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * User activity
   * @param user_id 
   * @returns 
   */
  async userActivity(user_id: string): Promise<UserOuput | any> {
    return await userDataLayer.getUserDetailAllActivity(user_id);
  }

  /**
   * clear users activity by user
   * @param user_id 
   * @returns 
   */
  async clearActivityList(user_id: string): Promise<UserOuput | any> {
    return await userDataLayer.clearAllUserActivity(user_id);
  }

  /**
   * Get user counts data
   */

  async getUserDataAsCounts():Promise<any>{

    let totalUsers = await userModel.findAll({raw: true});

    let activeUsers = totalUsers.filter((item:any)=>{
      return item.statusType === true || item.statusType === 1
    });

    return {total : totalUsers.length, activeUser : activeUsers.length};
  }
}

export default userServices;


import userDal from "../models/dal/users.dal";
import { loginUser } from "../models/dto/user.interface";
import userModel, { UserInput, UserOuput } from "../models/model/users.model";
import service from "./service";
import { antiPhishingCode, googleAuth, updateFundcode, updatepassword, updateUserPin, updateUserStatus, updateWhiteList } from "../utils/interface";
import speakeasy from "speakeasy";

import { lastLoginOuput } from "../models/model/lastLogin.model";
import { MarketProfitOuput } from "../models/model/marketProfit.model";
import sequelize from "../models";


let userDataLayer = new userDal();

class userServices {
  user: any;

 /**
   * Registers a new user.
   * 
   * This method creates a new user in the database using the provided payload
   * (which includes user information such as name, email, password, etc.).
   * 
   * @param payload - The input data for the new user.
   * @returns The result of the user creation process.
   */
  create(payload: UserInput): Promise<UserOuput | object> {
    return userDataLayer.create(payload);
  }

  /**
   * Checks if a user exists in the database by their unique ID.
   * 
   * This method verifies if a user exists by querying the database with the provided ID.
   * If the user does not exist, an error message is returned.
   * 
   * @param id - The unique identifier for the user.
   * @returns An object containing a success flag and user data or error message.
   */
  async checkIfUserExsit(id: number | string): Promise<object | null> {

    let user = await userDataLayer.userAlreadyExist(id);
    if (user === null) {
      return {
        success: false,
        message: "Opps! please check your credentials 1",
      };
    }
    return { success: true, data: user };
  }

   /**
   * Checks if a user's referral code already exists.
   * 
   * This method verifies if the given referral code is already in use.
   * 
   * @param refer - The referral code to check.
   * @returns An object containing the result of the check.
   */
  async checkUserReferCodeExist(refer: string): Promise<object | null> {
    return await userDataLayer.checkUserReferCodeExist(refer);
  }

  /**
   * Handles user login process.
   * 
   * This method attempts to authenticate a user by comparing the provided password
   * with the hashed password stored in the database. If successful, it returns user data.
   * If authentication fails, it returns an error message.
   * 
   * @param payload - The login credentials (username/email and password).
   * @returns The result of the login process, either success with user data or failure with an error message.
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
   * Sets up Google 2FA Authentication for a user.
   * 
   * This method verifies the Google 2FA code provided by the user. If the code is correct,
   * it updates the user's Two-Factor Authentication (2FA) settings.
   * 
   * @param payload - Contains the Google 2FA secret, token, and the user's credentials (user ID and password).
   * @returns A boolean indicating whether the verification was successful.
   */
  async googleAuth(payload: googleAuth): Promise<any> {
    try {
      // ======================================================
      // verify google 2FA code 
      // ======================================================

      const { secret, token, otp } = payload;
      if (secret && token) {
        // Verify the provided 2FA token using the secret
        const isVerified = speakeasy?.totp.verify({
          secret: secret,
          encoding: "base32",
          token: token,
        });

        // If 2FA verification is successful, update the user's settings
        if (isVerified && payload?.password) {
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
   * Updates user information.
   * 
   * This method attempts to update a user's details (except for the password and secret, which are removed before update).
   * First, it compares the provided password with the stored password hash. If the password is correct, 
   * it proceeds to update the user's data in the database. If the password is incorrect, it returns false.
   * 
   * @param payload - The user data to update, including the user ID, and any fields to be changed.
   * @returns A boolean indicating whether the update was successful or false if the password does not match.
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

        // console.log(pass,"============pass");


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
          return false;
        }
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Confirms whether the user's fund code matches the old password.
   * 
   * This method checks if the provided `old_password` matches the user's stored trading password.
   * If the passwords match, it returns true; otherwise, it throws an error.
   * 
   * @param payload - Contains the user's ID and the old password to check against the stored trading password.
   * @returns A boolean indicating if the old password matches the stored trading password.
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
   * Updates the user's trading password (fund code).
   * 
   * This method first checks if a trading password is already set. If a password exists, it verifies the 
   * provided `old_password` using the `confirmFundcode` method. If the old password matches, it updates 
   * the trading password to the new one. If no trading password is set, it directly updates to the new password.
   * 
   * @param payload - Contains the user's ID, the old trading password, and the new trading password.
   * @returns The result of the update process, or an error if the user is not found or passwords do not match.
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
   * Updates the user's whitelist status.
   * 
   * This method updates the user's whitelist status based on the provided payload. It first checks if the 
   * user exists in the database using their user ID. If found, it updates the `whitelist` field of the user record.
   * 
   * @param payload - Contains the `user_id` and the new whitelist status to be set.
   * @returns The result of the update process, or an error if the user is not found.
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
   * Confirms if the user's current password matches the old password.
   * 
   * This method compares the provided old password with the stored password in the database. If the password 
   * matches, it returns `true`. If the passwords do not match, it throws an error.
   * 
   * @param payload - Contains the `user_id` and the `old_password` to verify.
   * @returns A boolean indicating if the old password matches the stored password.
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
   * Confirms if the user's trading password matches the provided old password.
   * 
   * This method compares the provided old password with the stored trading password in the database. If the 
   * passwords match, it returns `true`. If they do not match, it throws an error.
   * 
   * @param payload - Contains the `user_id` and the `old_password` (trading password) to verify.
   * @returns A boolean indicating if the old trading password matches the stored password.
   */
  async confirmTradingPassword(payload: updatepassword): Promise<boolean> {
    try {
      let user = await userModel.findOne({ where: { id: payload.user_id }, raw: true });
      let data = user;

      let pass = service.bcypt.MDB_compareHash(
        `${payload.old_password}`,
        data?.tradingPassword
      );

      if (pass) {
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
   * Updates the user's account password.
   * 
   * This method first verifies if the user exists. Then, it hashes the new password using bcrypt and updates 
   * the password field in the database. Additionally, it updates the `pwdupdatedAt` timestamp field to reflect 
   * the password update time.
   * 
   * @param payload - Contains the `user_id`, `new_password`, and other relevant information.
   * @returns The updated user object after the password update.
   */
  async updatePassword(payload: updatepassword): Promise<UserOuput | any> {
    try {

      // console.log(payload.user_id);

      let user = await userModel.findOne({ where: { id: payload.user_id } });

      if (user) {
        let password = await service.bcypt.MDB_crateHash(payload?.new_password);

        await user.update({ password: password, pwdupdatedAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000) });
        return await userModel.findOne({ where: { id: payload.user_id }, raw: true });
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      console.log(error.message, "===errror here");

      throw new Error(error.message);
    }
  }

 /**
   * Set the user's trading password.
   * 
   * This method updates the user's trading password in the database. It first checks if the user exists. If the user 
   * is found, it updates the `tradingPassword` field with the new password provided in the payload.
   * 
   * @param payload - Contains the `user_id` and the new trading password.
   * @returns The result of the update operation, or an error if the user is not found.
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
   * Set the user's anti-phishing code.
   * 
   * This method updates the user's anti-phishing code in the database. It first checks if the user exists. If the user 
   * is found, it updates the `antiphishing` field with the new anti-phishing code provided in the payload.
   * 
   * @param payload - Contains the `user_id` and the new anti-phishing code.
   * @returns The result of the update operation, or an error if the user is not found.
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
   * Get the list of all users.
   * 
   * This method fetches and returns a list of all users from the database by calling the data layer method `getListOfUser`.
   * 
   * @returns An array of all user records from the database.
   */
  async getUsersList(): Promise<UserOuput[]> {
    return userDataLayer.getListOfUser();
  }

/**
   * Get the list of all users.
   * 
   * This method fetches and returns a list of all users from the database by calling the data layer method `getListOfUser`.
   * 
   * @returns An array of all user records from the database.
   */
  async getUsersListByLimit(offset: any, limit: any): Promise<UserOuput[]> {
    return userDataLayer.getListOfUserByLimit(offset, limit);
  }

 /**
   * Get the admin profit list.
   * 
   * This method fetches the list of admin profits from the database using the data layer method `getListOfAdminProfit`.
   * 
   * @returns An array of admin profit records.
   */
  async getAdminProfitList(): Promise<MarketProfitOuput[]> {
    return userDataLayer.getListOfAdminProfit();
  }

  /**
   * Get the list of all user activities.
   * 
   * This method fetches the list of user activities from the database by calling the data layer method `getListOfUserActivity`.
   * 
   * @returns An array of user activity records.
   */
  async getUsersActivityList(): Promise<lastLoginOuput[]> {
    return userDataLayer.getListOfUserActivity();
  }

 /**
   * Get a paginated list of user activities by offset and limit.
   * 
   * This method fetches a subset of user activities based on the provided `offset` and `limit`. 
   * It calls the data layer method `getListOfUserActivityByLimit` to retrieve the activities with pagination.
   * 
   * @param offset - The starting index for pagination (e.g., 0 for the first page).
   * @param limit - The number of activities to retrieve per page.
   * @returns A paginated list of user activities.
   */
  async getUsersActivityListByLimit(offset: string, limit: string): Promise<lastLoginOuput[]> {
    return userDataLayer.getListOfUserActivityByLimit(offset, limit);
  }

    /**
   * Get a paginated list of user activities by user ID, offset, and limit.
   * 
   * This method fetches user activities for a specific user identified by `userid`, using pagination parameters `offset` and `limit`.
   * 
   * @param userid - The ID of the user whose activities are being retrieved.
   * @param offset - The starting index for pagination (e.g., 0 for the first page).
   * @param limit - The number of activities to retrieve per page.
   * @returns A paginated list of activities for the specified user.
   */
  async getUsersActivityListByIdLimit(userid: string, offset: string, limit: string): Promise<lastLoginOuput[]> {
    return userDataLayer.getListOfUserActivityByIdLimit(userid, offset, limit);
  }

  /**
   * Update the user status (block/unblock).
   * 
   * This method updates the user's status in the database (block or unblock). It first checks if the user exists, and 
   * if so, it updates the `statusType` field with the new value provided in the payload.
   * 
   * @param payload - Contains the `id` of the user and the new `statusType` (e.g., "blocked", "active").
   * @returns The result of the update operation, or an error if the user is not found.
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
   * Update the user's pin code for security purposes.
   * 
   * This method updates the user's pin code in the database. It checks if the user exists and then updates the `pin_code` field 
   * with the new value provided in the payload.
   * 
   * @param payload - Contains the `id` of the user and the new `pin_code` for the user.
   * @returns The result of the update operation, or an error if the user is not found.
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
   * Fetch all user activity for a given user.
   * 
   * This method retrieves detailed activity data for the specified user by calling the `getUserDetailAllActivity` method from the data layer.
   * 
   * @param user_id - The ID of the user whose activity is being fetched.
   * @returns A list of the user's activities.
   */
  async userActivity(user_id: string): Promise<UserOuput | any> {
    return await userDataLayer.getUserDetailAllActivity(user_id);
  }

   /**
   * Clear all activities for a specific user.
   * 
   * This method clears all user activity records for a given user by calling the `clearAllUserActivity` method from the data layer.
   * 
   * @param user_id - The ID of the user whose activity list will be cleared.
   * @returns The result of the operation (whether the activity was successfully cleared).
   */
  async clearActivityList(user_id: string): Promise<UserOuput | any> {
    return await userDataLayer.clearAllUserActivity(user_id);
  }

 /**
   * Get the count of total and active users.
   * 
   * This method retrieves the total number of users and the number of active users from the database by querying `userModel` for all users. 
   * It then filters out the active users based on their `statusType`.
   * 
   * @returns An object with `total` (total users) and `activeUser` (number of active users).
   */
  async getUserDataAsCounts(): Promise<any> {

    let totalUsers = await userModel.findAll({ raw: true });

    let activeUsers = totalUsers.filter((item: any) => {
      return item.statusType === true || item.statusType === 1
    });

    return { total: totalUsers.length, activeUser: activeUsers.length };
  }

    /**
   * Kill excess database connections if they exceed the threshold.
   * 
   * This method checks the current number of database connections and compares it to a threshold. If the number of connections exceeds 90% of the threshold, 
   * it retrieves and kills excess connections to free up resources.
   * 
   * @returns Nothing; it logs messages indicating the success or failure of the operation.
   */

  async killExcessConnection() {
    const maxConnections = 300;
    const threshold = maxConnections * 0.9;
  
    try {
      // Fetch current number of connections
      const [results]:any = await sequelize.query("SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.PROCESSLIST");
      const currentConnections = results[0].count;

      if (currentConnections > threshold) {
        // Fetch IDs of connections to kill if they exceed the threshold
        const excessCount = currentConnections - threshold;
        const [killResults]:any = await sequelize.query(`
          SELECT GROUP_CONCAT(CONCAT('KILL ', id) SEPARATOR '; ') AS kill_commands
          FROM INFORMATION_SCHEMA.PROCESSLIST
          LIMIT ${excessCount}
        `);
  
        const killCommands = killResults[0].kill_commands;
        if (killCommands) {
          // Execute the KILL commands
          await sequelize.query(killCommands);
          console.log('Excess connections killed successfully.');
        }
      } else {
        console.log('No excess connections to kill.');
      }
    } catch (error) {
      console.error('Failed to kill excess connections:', error);
    }
  }
  
}

export default userServices;

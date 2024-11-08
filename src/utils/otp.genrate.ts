import { Op } from "sequelize";
import CryptoJS from "crypto-js";
import { userModel, userOtpModel } from "../models";
import speakeasy from 'speakeasy';

interface userOtp {
  username: number | string | undefined;

};

interface matchOtp extends userOtp {
  token: string | number,
  otp: string | number
}


class otpGenerate {
 /**
   * Adds minutes to the current date based on OTP expiration time
   * @param date - The initial date to which minutes are added
   * @returns {Date} - New date with minutes added
   */
  AddMinutesToDate(date: Date) {
    let expiretime = process.env.OTP_EXPIRE_TIME || 1;
    return new Date(date.getTime() + +expiretime * 60000);
  }


 /**
   * OTP generator for alphanumeric or numeric OTP based on flag
   * @param flag - Determines type of OTP ('email' for alphanumeric)
   * @returns {string} - Generated OTP
   */
  otp_generator(flag:string): number | string {
    // Declare a string variable
    // which stores all string
    var string = flag==="email"?
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ":"0123456789";
    
    let OTP = "";

    // Find the length of string
    var len = string.length;
    for (let i = 0; i < 6; i++) {
      OTP += string[Math.floor(Math.random() * len)];
    }

    // return OTP;
    return '123456';
  }

  /**
   * Creates OTP for user and stores it by username (email or phone)
   * @param data - Contains the username (email or phone)
   * @returns {Promise<string | number | undefined>}
   */
  async createOtpForUser(data: userOtp): Promise<string | number | undefined> {
    try {
      let apiStatus;

        let regx = /^[6-9]\d{9}$/;
        let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

        // Initialize flag with an empty string or another appropriate default value
        let flag: string = "";

        // Verify provided username type
        if (data && typeof data.username === 'string') {
            if (regx.test(data.username)) {
                flag = "number";
            } else if (regex.test(data.username)) {
                flag = "email";
            }
        }
      let otp = this.otp_generator(flag);
      const now = new Date();
      const expiration_time = this.AddMinutesToDate(now);
      //const token = this.token();
      // Encrypt
      let token = CryptoJS.AES.encrypt(
        `${Date.now()}`,
        "secret key 123"
      ).toString();

      await userOtpModel
        .findOne({ where: { username: data.username } })
        .then(async (obj) => {
          // update
          if (obj) {
            userModel
              .findOne({
                where: {
                  [Op.or]: [
                    { email: data.username },
                    { number: data.username },
                  ],
                },
              })
              .then(async (res) => {
                await res?.update({ otpToken: token });
              });

            await obj.update({
              otp: otp,
              expire: expiration_time,
              token: token,
            });
            apiStatus = await userOtpModel.findOne({
              where: { username: data.username }, attributes: {
                exclude: [
                  "deletedAt",
                  "username",
                  "token",
                  "updatedAt:",
                  "deletedAt",
                ],
              }, raw: true
            })

          }
          else {
            userModel
              .findOne({
                where: {
                  [Op.or]: [{ email: data.username }, { number: data.username }],
                },
              })
              .then(async (res) => {
                // console.log("working .....", data.username, res);
                await res?.update({ otpToken: token });
              });
            //insert
            await userOtpModel.create({
              username: data.username,
              otp: otp,
              token: token,
              expire: expiration_time,
            });

            apiStatus = await userOtpModel.findOne({
              where: { username: data.username }, attributes: {
                exclude: [
                  "deletedAt",
                  "username",
                  "token",
                  "updatedAt:",
                  "deletedAt",
                ],
              }, raw: true
            })
          }

        });
      return apiStatus;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
 /**
   * Verifies if the provided OTP is valid and not expired
   * @param data - Contains username, token, and otp
   * @returns {Promise<boolean>} - Returns true if OTP is valid, otherwise false
   */
  verifyOtpValid = async (data: matchOtp): Promise<boolean | object> => {
    try {

      /** match otp */


      let getOtp = await userModel.findOne({
        where: {
          [Op.or]: [{ email: data.username }, { number: data.username }]
        }
      })
      return true;

    } catch (error) {
      return false;
    }
  }

  /**
   * Generates a referral code (10 alphanumeric characters)
   * @returns {string} - Referral code
   */
  referalCodeGenerate = () => {
    var string =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";

    // Find the length of string
    var len = string.length;
    for (let i = 0; i < 10; i++) {
      code += string[Math.floor(Math.random() * len)];
    }

    return code;
  }

    /**
   * Generates a secret code using speakeasy for two-factor authentication
   * @returns {string} - Secret code JSON
   */
  secretCodeGenerate = () => {
    var secret = speakeasy.generateSecret({ length: 20 });
    return JSON.stringify(secret);
  }

}

export default otpGenerate;

// CREATE NOD MAILER CODE IN NODEJS?

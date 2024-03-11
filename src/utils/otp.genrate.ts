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
   * To add minutes to the current time
   * @param date
   * @returns
   */
  AddMinutesToDate(date: Date) {
    let expiretime = process.env.OTP_EXPIRE_TIME || 1;
    return new Date(date.getTime() + +expiretime * 60000);
  }


  /**
   * otp generator
   * @returns 
   */

  otp_generator(): number | string {
    // Declare a string variable
    // which stores all string
    var string =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let OTP = "";

    // Find the length of string
    var len = string.length;
    for (let i = 0; i < 6; i++) {
      OTP += string[Math.floor(Math.random() * len)];
    }

    return OTP;
    // return '123456';
  }

  /**
   * create otp for user and store in by user email / phone number
   * @param date
   * @returns
   */
  async createOtpForUser(data: userOtp): Promise<string | number | undefined> {
    try {
      let apiStatus;
      let otp = this.otp_generator();
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
   * verfiy user provide otp is valid or expired
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
  secretCodeGenerate = () => {
    var secret = speakeasy.generateSecret({ length: 20 });
    return JSON.stringify(secret);
  }

}

export default otpGenerate;

// CREATE NOD MAILER CODE IN NODEJS?

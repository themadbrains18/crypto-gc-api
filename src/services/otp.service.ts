import { userModel, userOtpModel } from "../models";
import { Op } from "sequelize";
import { matchWithData, otpSchema } from "../models/dto/otp.inerface";


class otpService {

   /**
   * Matches the provided OTP against the stored token for a user.
   * 
   * This method checks if the OTP provided by the user matches the token stored in the database for the user. 
   * It also checks whether the token has expired or is associated with the correct user account.
   * 
   * @param {otpSchema} data - The data containing the username (email/phone) and OTP token to be matched.
   * @returns {Promise<boolean>} Returns true if the OTP is valid and not expired, otherwise throws an error.
   * @throws {Error} Throws an error if the OTP is expired or not associated with the correct account.
   */
  async match(data: otpSchema): Promise<any> {
    let userToken = await userModel.findOne({
      where: {
        [Op.or]: [{ email: data.username }, { number: data.username }], //otp.username
      },
    });

    let token = userToken?.otpToken;
    let userTokenTable = await userOtpModel.findOne({
      where: {
        username: data.username,
      },
    });
    let token2 = userTokenTable?.token;
    // match token same token is assocate with same user
    if (token == data.token && token2 == data.token) {
      const expire = new Date(`${userTokenTable?.expire}`).getTime();
      const updateDate = Date.now();

      let expireDate = Math.floor(expire / 1000);
      let currentDate = Math.floor(updateDate / 1000);
      if (expireDate >= currentDate) {
        return true;
      } else {
        throw new Error("Sorry your otp is expired.");
      }
    } else {
      throw new Error(
        "Sorry token is not assocated with your account."
      );
    }
    return token;
  }

    /**
   * Matches the OTP for registration or login verification.
   * 
   * This method checks if the provided OTP matches the one stored for the user and if the OTP is not expired.
   * 
   * @param {matchWithData} data - The data containing the username (email/phone) and OTP to be verified.
   * @returns {Promise<boolean>} Returns a success message if the OTP is valid, otherwise an error message.
   * @throws {Error} Throws an error if the OTP is expired or incorrect.
   */

  async matchOtp(data: matchWithData): Promise<boolean | any> {
    let userTokenTable = await userOtpModel.findOne({
      where: {
        username: data.username,
      },
      raw: true
    });

    const expire = new Date(`${userTokenTable?.expire}`).getTime();
    const updateDate = Date.now();

    let expireDate = Math.floor(expire / 1000);
    let currentDate = Math.floor(updateDate / 1000);


    if (data.otp == userTokenTable?.otp) {
      if (expireDate >= currentDate) {
        return { "success": true, "message": 'Otp Matched!!' };
      } else {
        return { "success": false, "message": 'Sorry your otp is expired.' };
        throw new Error("Sorry your otp is expired.");
      }
    } else {
      return { "success": false, "message": 'You enter the wrong otp.' };
      throw new Error("You enter the wrong otp.");

    }
  }
}
export default otpService;

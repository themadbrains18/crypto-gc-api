import { userModel, userOtpModel } from "../models";
import { Op } from "sequelize";
import { matchWithData, otpSchema } from "../models/dto/otp.inerface";


class otpService {
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

  // match register / login

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

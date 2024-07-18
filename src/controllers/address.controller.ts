import { Response, Request, NextFunction } from "express";
import BaseController from "./main.controller";
import service from "../services/service";
import networkModel, { networkInput } from "../models/model/network.model";
import { addressInput } from "../models/model/address.model";
import WAValidator from 'multicoin-address-validator';

class addressController extends BaseController {
  protected async executeImpl(
    req: Request,
    res: Response
  ): Promise<void | any> {
    try {
      // ... Handle request by creating objects
    } catch (error: any) {
      return this.fail(res, error.toString());
    }
  }

  /**
   * Get all token
   * @param req
   * @param res
   */
  async addressAll(req: Request, res: Response, next: NextFunction) {
    try {
      let networks = await service.address.all();
      super.ok<any>(res, networks);
    } catch (error) {
      next(error);
    }
  }

  /**
   * create a netwok
   * @param req
   * @param res
   */
  async create(req: Request, res: Response) {
    try {

      let payload = req.body;


      let network: any = await networkModel.findOne({ where: { id: payload.networkId }, raw: true });

      var valid = WAValidator.validate(`${payload.address}`,`${network?.symbol.toLowerCase()}`,'testnet');
      if (valid)
        console.log('This is a valid address');
      else
        console.log('Address INVALID');

      // return super.ok<any>(res, 'valid');
      // var myHeaders = new Headers();
      // myHeaders.append("Content-Type", "application/json");

      // var raw = JSON.stringify({
      //   "address": `${payload.address}`,
      //   "currency": `${network?.symbol.toLowerCase()}`
      // });

      // var requestOptions: any = {
      //   method: 'POST',
      //   headers: myHeaders,
      //   body: raw,
      //   redirect: 'follow'
      // };

      // let validAddress = await fetch("https://checkcryptoaddress.com/api/check-address", requestOptions);

      // let isValid = await validAddress.json();

      if (valid && payload.step === 1) {
        return super.ok<any>(res, 'valid');
      }
      else if (payload.step === 1) {
        return super.fail(res, 'Invalid Address');
      }

      let userOtp;
      if (payload?.otp === '' || payload?.otp === 'string' || payload.otp === null) {
        userOtp = { username: req?.body?.username };

        let otp: any = await service.otpGenerate.createOtpForUser(userOtp);

        const emailTemplate = service.emailTemplate.otpVerfication(`${otp?.otp}`);

        service.emailService.sendMail(req.headers["X-Request-Id"], {
          to: userOtp.username,
          subject: "Verify OTP",
          html: emailTemplate.html,
        });
        delete otp["otp"];
        super.ok<any>(res, { message: "OTP sent in your inbox. please verify your otp", otp });
      }
      else {
        //  send email otp to user

        if (req.body?.otp) {
          userOtp = {
            username: req?.body?.username,
            otp: req.body?.otp,
          };     
            let result = await service.otpService.matchOtp(userOtp);

          if (result.success === true) {
            delete payload?.username
            let responseData = await service.address.create(payload);
            super.ok<any>(res, responseData);
          }
          else {
            super.fail(res, result.message);
          }
        }
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  async userAddress(req: Request, res: Response) {
    try {

      const {offset,limit} = req.params
      let responseData = await service.address.addressById(req.body.user_id,offset,limit);
      super.ok<any>(res, responseData);

    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
 *
 * @param res
 * @param req
 */
  async activeInactiveAddress(req: Request, res: Response, next: NextFunction) {
    try {
      let { id, status } = req.body;

      let data: any = { id, status };

      let statusResponse = await service.address.changeStatus(data);
      if (statusResponse) {
        let trades = await service.address.all();
        return super.ok<any>(res, trades);
      } else {
        super.fail(res, statusResponse);
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

    /**
  * 
  * @param res 
  * @param req 
  */
    async deleteAddress(req: Request, res: Response) {
      try {
  
        let address = await service.address.deleteAddress(req.params.addressid, req.params.userid);
  
        super.ok<any>(res, address);
      } catch (error: any) {
        super.fail(res, error.message);
      }
    }
}

export default addressController;

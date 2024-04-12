import { Request, Response } from "express";
import BaseController from "./main.controller";
import withdrawDto from "../models/dto/withdraw.dto";
import service from "../services/service";
import { networkModel } from "../models";
import WAValidator from 'multicoin-address-validator';
// import { validate } from 'crypto-address-validator-ts';

class withdrawController extends BaseController {
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
   *
   * @param req
   * @param res
   */
  async addnewRequest(req: Request, res: Response) {
    try {
      let payload: withdrawDto = req.body;

      let network = await networkModel.findOne({where : {id : payload.networkId},raw : true});

      var valid = WAValidator.validate(`${payload.withdraw_wallet}`,`${network?.symbol.toLowerCase()}`,'testnet');
      if (valid)
        console.log('This is a valid address');
      else
        console.log('Address INVALID');
      // var myHeaders = new Headers();
      // myHeaders.append("Content-Type", "application/json");

      // var raw = JSON.stringify({
      //   "address": `${payload.withdraw_wallet}`,
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
      else if(payload.step === 1) {
        return super.fail(res, 'Invalid Address');
      }

      let userOtp;
      if (payload?.otp === '' || payload?.otp === 'string' || payload.otp === null) {
        userOtp = { username: req?.body?.username };

        let otp:any = await service.otpGenerate.createOtpForUser(userOtp);

        const emailTemplate = service.emailTemplate.otpVerfication(`${otp?.otp}`);

        service.emailService.sendMail(req.headers["X-Request-Id"], {
          to: userOtp.username,
          subject: "Verify OTP",
          html: emailTemplate.html,
        });
        delete otp["otp"];
        super.ok<any>(res, {message : "OTP sent in your inbox. please verify your otp", otp});
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
            let responseData = await service.withdrawServices.create(payload);
            super.ok<any>(res, responseData);
          }
          else{
            super.fail(res, result.message);      
          }
        }
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
  /**
   *
   * @param req
   * @param res
   */
  async withdrawListbyUserID(req: Request, res: Response) {
    try {
      let responseData = await service.withdrawServices.listById(req.params.userid);
      super.ok<any>(res, responseData);

    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  async userWithdrawHistory(req: Request, res: Response) {
    try {
      let responseData = await service.withdrawServices.historyById(req.params.userid);
      super.ok<any>(res, responseData);

    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
  async userWithdrawHistoryByLimit(req: Request, res: Response) {
    try {
      let {offset,limit} = req?.params
      let responseData = await service.withdrawServices.historyById(req.params.userid);
      let responseDataPaginate = await service.withdrawServices.historyByIdLimit(req.params.userid,offset,limit);
      super.ok<any>(res, {data:responseDataPaginate,total:responseData.length});

    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   * admin get all withdrawList
   * @param req
   * @param res
   */
  async withdrawList(req: Request, res: Response) {
    try {
      let withdrawResponse = await service.withdrawServices.getwithdrawList();
      super.ok<any>(res, withdrawResponse);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
  /**
   * 
   * admin get all withdrawListByLimit
   * @param req
   * @param res
   */
  async withdrawListByLImit(req: Request, res: Response) {
    try {
      let { offset, limit } = req.params;
      let withdrawResponse = await service.withdrawServices.getwithdrawList();
      let withdrawResponseByLimit = await service.withdrawServices.getwithdrawListByLimit(offset,limit);
      super.ok<any>(res, { data: withdrawResponseByLimit, total: withdrawResponse.length } );
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }


}

export default withdrawController;

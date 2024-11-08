import { Request, Response } from "express";
import BaseController from "./main.controller";
import withdrawDto from "../models/dto/withdraw.dto";
import service from "../services/service";
import { networkModel, userModel } from "../models";
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
   * Adds a new withdrawal request.
   * 
   * @param req - The request object containing withdrawal details.
   * @param res - The response object used to send back the response.
   * @returns {Promise<void>} - Returns a promise that resolves once the request is processed.
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

      let user= await userModel?.findOne({where:{}})

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

            let userRecord:any = await userModel.findOne({ where: { email: req?.body?.username }, raw: true });
            if (userRecord.lockUntil && userRecord.lockUntil > new Date()) {
              throw new Error(
                "Your account is susceptible to high risk. Please try again after 4 hours.",
              );
            }
            let loginAttempts = userRecord.loginAttempts || 0;
            loginAttempts += 1;

            let updateData: any = { loginAttempts: loginAttempts };
            if (loginAttempts >= 10) {
              updateData.lockUntil = new Date(new Date().getTime() + 4 * 60 * 60 * 1000);
            }

            await userModel.update(updateData, { where: { email: req?.body?.username } });


            return super.fail(res, result.message);
          }
        }
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   * Retrieves the withdrawal list by user ID.
   * 
   * @param req - The request object containing user ID in the parameters.
   * @param res - The response object used to send back the response.
   * @returns {Promise<void>} - Returns a promise with the response data.
   */
  async withdrawListbyUserID(req: Request, res: Response) {
    try {
      let responseData = await service.withdrawServices.listById(req.params.userid);
      super.ok<any>(res, responseData);

    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   * Retrieves the withdrawal history by user ID.
   * 
   * @param req - The request object containing user ID in the parameters.
   * @param res - The response object used to send back the response.
   * @returns {Promise<void>} - Returns a promise with the withdrawal history.
   */
  async userWithdrawHistory(req: Request, res: Response) {
    try {
      let responseData = await service.withdrawServices.historyById(req.params.userid);
      super.ok<any>(res, responseData);

    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   * Retrieves user withdrawal history with pagination.
   * 
   * @param req - The request object containing user ID and pagination details.
   * @param res - The response object used to send back the paginated withdrawal history.
   * @returns {Promise<void>} - Returns a promise with the paginated withdrawal history.
   */
  async userWithdrawHistoryByLimit(req: Request, res: Response) {
    try {
      let {offset,limit, currency, date} = req?.params

      let responseDataPaginate = await service.withdrawServices.historyByIdLimit(req.params.userid,offset,limit, currency,date);
      super.ok<any>(res, {data:responseDataPaginate?.data,total:responseDataPaginate.length, totalAmount:responseDataPaginate?.totalAmount});

    } catch (error: any) {
      super.fail(res, error.message);
    }
  }


  /**
   * Admin retrieves all withdrawal requests.
   * 
   * @param req - The request object.
   * @param res - The response object used to send back the withdrawal list.
   * @returns {Promise<void>} - Returns a promise with the withdrawal list.
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
   * Admin retrieves withdrawal requests with pagination.
   * 
   * @param req - The request object containing pagination details.
   * @param res - The response object used to send back the paginated withdrawal list.
   * @returns {Promise<void>} - Returns a promise with the paginated withdrawal list.
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

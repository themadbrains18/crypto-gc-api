import { Response, Request, NextFunction } from "express";
import BaseController from "./main.controller";
import service from "../services/service";
import paymentMethodDto from "../models/dto/p_method.dto";
import userPaymentMethodDto from "../models/dto/user_p_method.dto";
import Joi from "joi";
import { paymentMethodModel, userModel } from "../models";
import { isEmpty } from "lodash";
import { matchWithData } from "../models/dto/otp.inerface";

class paymentController extends BaseController {
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
  * Add new payment method from admin dashboard
  * @param res
  * @param req
  */
  async create(req: Request, res: Response, next: NextFunction) {
    try {

      // const obj = JSON.parse(JSON.stringify(req.files));
      // for (let itm in obj) {
      //   req.body[itm] = obj[itm][0]?.filename;
      // }

      let method: paymentMethodDto = req.body;
      let paymentResponse = await service.p_method.create(method);

      // console.log(paymentResponse,'===========paymentResponse');


      if (paymentResponse.hasOwnProperty('status') && paymentResponse.status !== 200) {
        return super.fail(res, paymentResponse.message === "" ? paymentResponse.additionalInfo : paymentResponse.message);
      }

      super.ok<any>(res, { message: 'Payment method added successfully!.', result: paymentResponse });
    } catch (error) {
      next(error);
    }
  }

  /**
   *
   * @param res
   * @param req
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {

      let paymentResponse = await service.p_method.getMethodList();

      super.ok<any>(res, paymentResponse);

    } catch (error) {
      next(error);
    }
  }

  /**
   *
   * @param res
   * @param req
   */
  async single(req: Request, res: Response, next: NextFunction) {
    try {
      let paymentResponse = await service.p_method.getPaymentMethodById(req.params.id);
      super.ok<any>(res, paymentResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   *
   * @param res
   * @param req
   */

  async addMethod(req: Request, res: Response) {
    try {

      if (
        req.body?.otp === "string" ||
        req.body?.otp === "" ||
        req.body?.otp === null
      ) {

        let passCodeVerify = await userModel.findOne({
          where: { id: req.body.user_id },
          attributes: {
            exclude: ['id', 'dial_code', 'password', 'otpToken', 'cronStatus', 'deletedAt', 'TwoFA', 'kycstatus', 'statusType', 'registerType', 'role', 'secret', 'own_code', 'refeer_code', 'antiphishing', 'createdAt', 'updatedAt', 'UID']
          },
          raw: true
        })

        let userOtp:any = { username: passCodeVerify?.email ? passCodeVerify?.email : passCodeVerify?.number };

        let otp: any = await service.otpGenerate.createOtpForUser(userOtp);

        const emailTemplate = service.emailTemplate.otpVerfication(`${otp?.otp}`);

        service.emailService.sendMail(req.headers["X-Request-Id"], {
          to: userOtp?.username,
          subject: "Verify OTP",
          html: emailTemplate.html,
        });

        return super.ok<any>(
          res,
          "OTP sent in your inbox. please verify your otp"
        );
      }

      let uMethod: userPaymentMethodDto = req.body;

      if (isEmpty(uMethod.pmObject)) {
        return super.fail(res, "Please select payment method..")
      }

      let p_method: any = await paymentMethodModel.findOne({ where: { id: uMethod.pmid }, raw: true });

      let pmobj: any = { passcode: Joi.string().required() };
      let fieldsArray: any = p_method.fields;
      for (const field of fieldsArray) {
        if (field.type === 'text' || field.type === "name") {
          pmobj[field.name] = Joi.string().required();
        }
        if (field.type === 'number') {
          pmobj[field.name] = Joi.number().integer().required();
        }
        if (field.type === 'file') {
          // pmobj[field.name] = Joi.binary().encoding('utf8').optional();
        }
      }

      let user_pmethod_schema = Joi.object().keys({
        user_id: Joi.string().required(),
        pmid: Joi.string().required(),
        status: Joi.string().required(),
        pm_name: Joi.string().required(),
        pmObject: Joi.object(pmobj).optional(),
        otp: Joi.number().required()
      })


      const result2 = user_pmethod_schema.validate(uMethod);

      if (result2.error !== undefined) {
        return super.fail(res, result2.error?.message);
      }

      let userpMethodResponse = await service.p_method.createUserPaymentMethod(uMethod);
      super.ok<any>(res, { message: "User payment method added successfully!!!.", result: userpMethodResponse });

    } catch (error: any) {
      super.fail(res, error.message)
    }
  }

  /**
   *
   * @param res
   * @param req
   */
  async getMethod(req: Request, res: Response) {
    try {
      let methodResponse = await service.p_method.getUserMethod(req.body.user_id);
      super.ok<any>(res, methodResponse);
    } catch (error: any) {
      super.fail(res, error.message)
    }
  }

  /**
   *
   * @param res
   * @param req
   */
  async deleteRequest(req: Request, res: Response) {
    try {
      let deleteResponse = await service.p_method.removeUserMethodById(req.params.id);
      super.ok<any>(res, deleteResponse);
    } catch (error: any) {
      super.fail(res, error.message)
    }
  }
}

export default paymentController
import { Response, Request, NextFunction } from "express";
import BaseController from "./main.controller";
import kycDto from "../models/dto/kyc.dto";
import service from "../services/service";
import kycSchema from "../validators/kyc.validator";
import kycDal from "../models/dal/kyc.dal";
import fileUpload from "../utils/multer";
import userDal from "../models/dal/users.dal";

class kycController extends BaseController {

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
   * Creates a new KYC record for a user.
   * @param {Request} req - Express request object with KYC data in body.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next function.
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      
      let kyc: kycDto = req.body;
      kyc.userid = req?.body?.user_id;
      
      let kycAlreadyAdded = await service.kyc.alreadyExist(kyc);

      // if already kyc available but in pending state
      if ( kycAlreadyAdded && (kycAlreadyAdded?.isReject === false || kycAlreadyAdded?.isReject === 0)) {
        return super.clientError(res, {
          message: "Sorry, you are already submit kyc request!!",
          result: kycAlreadyAdded
        })
      }

      // if already kyc available but admin rejected and user re-submit request
      if (kycAlreadyAdded &&  (kycAlreadyAdded?.isReject === true || kycAlreadyAdded?.isReject === 1)) {
        kyc.isReject = false;
        kyc.isVerified = false;
        let tokenResponse = await service.kyc.edit(kyc);
        return super.ok<any>(res, { message: "Kyc successfully updated.", result: tokenResponse })
      }

      // kyc.userid = req.body.user_id;
      let tokenResponse = await service.kyc.create(kyc);
      super.ok<any>(res, { message: "Kyc successfully Added.", result: tokenResponse })

    } catch (error: any) {
      return super.fail(res, error?.message);
    }
  }


  /**
   * 
   * @param res 
   * @param req 
   */
  institutecreate(req: Request, res: Response) {

  }

  /**
   * Fetches KYC information by user ID.
   * @param {Request} req - Express request object with user ID in params.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next function.
   */
  async kycById(req: Request, res: Response, next: NextFunction) {
    try {

      let kycResponse = await service.kyc.getKycById(req.params.id);

      super.ok<any>(res, { message: "user Kyc", result: kycResponse });

    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates KYC status (approve or reject).
   * @param {Request} req - Express request object with status data in body.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next function.
   */
  async kycStatus(req: Request, res: Response, next: NextFunction) {
    try {
      let kyc: kycDto = req.body;

      

      let userKyc = await service.kyc.alreadyExist(kyc);
      
      if (userKyc) {
        let kycResponse = await service.kyc.updateStatus(kyc);
        if (kycResponse) {
          let userService = new userDal();
          let user = await userService.checkUserByPk(kycResponse.userid);

          if (user.email !== null) {
            let status = 'Pending';
            
            if ( Number(kycResponse.isReject) === 1) {
              status = "Rejected"
            }
            else if ( Number(kycResponse.isVerified) === 1) {
              status = "Verified"
            }
            const emailTemplate = service.emailTemplate.kycVerification(status);

            service.emailService.sendMail(req.headers["X-Request-Id"], {
              to: user.email,
              subject: "KYC Status",
              html: emailTemplate.html,
            });
          }

          let kycs = await service.kyc.getAllKyc('All');
          super.ok<any>(res, { message: "Kyc status successfully updated.", result: kycs })
        }
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves all KYC records based on type.
   * @param {Request} req - Express request object with type in params.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next function.
   */
  async kycAll(req: Request, res: Response, next: NextFunction) {
    try {

      let kycs = await service.kyc.getAllKyc(req.params.type);
      super.ok<any>(res, kycs);
    } catch (error: any) {
      next(error);
    }
  }
  /**
   * Retrieves paginated KYC records.
   * @param {Request} req - Express request object with offset, limit, and type in params.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next function.
   */
  async kycAllByLimit(req: Request, res: Response, next: NextFunction) {
    try {
      let { offset, limit } = req.params;
      let kycs = await service.kyc.getAllKyc(req.params.type);

      let kycPaginated = await service.kyc.getAllKycByLimit(req.params.type, offset, limit);
      super.ok<any>(res, { data: kycPaginated, total: kycs });
    } catch (error: any) {
      next(error);
    }
  }


}


export default kycController
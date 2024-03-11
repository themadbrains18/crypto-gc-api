import { NextFunction, Request, Response } from "express";
import BaseController from "./main.controller";
import service from "../services/service";
import { stakingDto, tokenStakeDto } from "../models/dto/staking.dto";
import { assetModel, stakingModel } from "../models";
import { assetsWalletType } from "../utils/interface";


class stakingController extends BaseController {
    /**
   * get user assets list here
   * @param req
   * @param res
   */
    async saveStaking(req: Request, res: Response, next: NextFunction) {
        try {

            let staking: stakingDto = req.body;

            let stakingResponse = await service.staking.create(staking);

            super.ok<any>(res, { message: "Staking Added successfully!.", result: stakingResponse });

        } catch (error) {
            next(error);
        }
    }

    /**
     * get user assets list here
     * @param req
     * @param res
     */
    async stakingRelease(req: Request, res: Response) {
        try {

            let stak = await stakingModel.findOne({ where: { status: true, queue: true, redeem: false, id: req?.body?.id }, raw: true });
            if (stak && req.body?.step === 1) {
                return super.ok<any>(res, { result: "Stake is ready for redeem!!" });
            }
            let userOtp;
            if (
                req.body?.otp === "string" ||
                req.body?.otp === "" ||
                req.body?.otp === null
            ) {
                userOtp = { username: req.body?.username };

                let otp:any = await service.otpGenerate.createOtpForUser(userOtp);

                const emailTemplate = service.emailTemplate.otpVerfication(`${otp}`);

                service.emailService.sendMail(req.headers["X-Request-Id"], {
                  to: userOtp.username,
                  subject: "Verify OTP",
                  html: emailTemplate.html,
                });
                delete otp["otp"];
                // Return a 200
                super.ok<any>(
                    res, { result: "OTP sent in your inbox. Please verify your otp to redeem assets", otp });
            }
            else {
                if (req.body?.otp) {
                    userOtp = {
                        username: req.body?.username,
                        otp: req.body?.otp,
                    };

                    let result = await service.otpService.matchOtp(userOtp);
                    if (result.success === true) {
                        let stakingResponse = await service.staking.releaseStaking(req.body.id);
                        super.ok<any>(res, { message: "Staking release successfully!.", result: stakingResponse });
                    }
                    else {
                        return super.fail(res, result.message);
                    }
                }
            }

        } catch (error: any) {
            return super.fail(res, error.message);
        }
    }

    /**
     * get user assets list here
     * @param req
     * @param res
     */
    async getAllStaking(req: Request, res: Response) {
        try {
            let stakingResponse = await service.staking.getAllStaking(req?.body?.user_id);

            super.ok<any>(res, stakingResponse);
        } catch (error) {

        }
    }

    /**
     * get user assets list here
     * @param req
     * @param res
     */
    async getStakedByToken(req: Request, res: Response) {
        let stakingResponse = await service.staking.getStakingByToken(req.params.tokenid, req.params.userid);
        super.ok<any>(res, stakingResponse)
    }

    async unstakingToken(req: Request, res: Response) {
        try {
            let stak = await stakingModel.findOne({ where: { status: false, queue: false, redeem: false, unstacking : false, id: req?.body?.id }, raw: true });
            if (stak) {
                let assetData = await assetModel.findOne({ where: { token_id: stak.token_id, user_id: stak.user_id, walletTtype: assetsWalletType.main_wallet },raw: true });
                if(assetData){
                    let bal = assetData!.balance + (stak.amount);
                    await assetModel.update({ balance: bal },{where : {token_id: stak.token_id, user_id: stak.user_id, walletTtype: assetsWalletType.main_wallet}});
                }
                await stakingModel.update({unstacking : true},{where :{status: false, queue: false, redeem: false, unstacking : false, id: req?.body?.id}});
                stak.unstacking = true;
                return super.ok<any>(res, { result: stak, message : 'Token unstake successfully!!.' });
            }
        } catch (error:any) {
            super.fail(res, error.message);
        }

    }


    // =============================================================
    // Admin Api to token stake add
    // =============================================================

    async saveTokenStake(req: Request, res: Response, next: NextFunction) {
        try {

            let staking: tokenStakeDto = req.body;

            let stakingResponse = await service.staking.createStake(staking);
            if (stakingResponse) {
                let tokens = await service.token.adminTokenAll();
                return super.ok<any>(res, { message: "Staking Added successfully!.", result: tokens });
            }

            // super.ok<any>(res, { message: "Staking Added successfully!.", result: stakingResponse });

        } catch (error) {
            next(error);
        }
    }
}

export default stakingController;
import userPmethodModel, { userPmethodInput, userPmethodOuput } from "../model/user_p_method";
import userPaymentMethodDto from "../dto/user_p_method.dto";
import userModel from "../model/users.model";
import paymentMethodModel from "../model/p_method.model";
import service from "../../services/service";
import { matchWithData } from "../dto/otp.inerface";

class userPaymentMethodDal {

    /**
     * Create user payment methods
     * @param payload 
     * @returns 
     */
    async create(payload: any): Promise<userPmethodOuput | any> {

        try {
            let passCodeVerify = await userModel.findOne({
                where: { id: payload.user_id },
                attributes: {
                    exclude: ['id', 'dial_code', 'password', 'otpToken', 'cronStatus', 'deletedAt', 'TwoFA', 'kycstatus', 'statusType', 'registerType', 'role', 'secret', 'own_code', 'refeer_code', 'antiphishing', 'createdAt', 'updatedAt', 'UID']
                },
                raw: true
            })

            let pass = service.bcypt.MDB_compareHash(
                `${payload?.pmObject?.passcode}`,
                passCodeVerify!.tradingPassword
            );

            let userOtp: matchWithData = {
                username: passCodeVerify?.email! ? passCodeVerify?.email! : passCodeVerify?.number!,
                otp: payload?.otp!,
            };

            let result = await service.otpService.matchOtp(userOtp);

            if (pass && result.success === true) {
                return await userPmethodModel.create(payload);
            }
            else {
                if(pass ===false){
                    throw new Error('Trading password you enter not correct.Please verify trading password');
                }
                if(result.success === false){
                    throw new Error(result?.message);
                }
            }

        } catch (err: any) {
            throw new Error(err);
        }
    }

    /**
     * Get payment methods by user id
     * @param payload 
     * @returns 
     */
    async getUserMethod(payload: string): Promise<userPmethodOuput | any> {
        try {
            return await userPmethodModel.findAll({
                where: { user_id: payload },
                include: [
                    {
                        model: paymentMethodModel,
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "deletedAt"]
                        },
                    }
                ]
            })
        } catch (error: any) {
            throw new Error(error.message);
        }

    }

    /**
     * Remove user payment method
     * @param payload 
     * @returns 
     */
    async removeUserMethodById(payload: string): Promise<userPmethodOuput | any> {
        try {
            return await userPmethodModel.destroy({ where: { id: payload } });
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message);
        }
    }
}

export default new userPaymentMethodDal();
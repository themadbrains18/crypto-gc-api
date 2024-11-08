import userPmethodModel, { userPmethodInput, userPmethodOuput } from "../model/user_p_method";
import userPaymentMethodDto from "../dto/user_p_method.dto";
import userModel from "../model/users.model";
import paymentMethodModel from "../model/p_method.model";
import service from "../../services/service";
import { matchWithData } from "../dto/otp.inerface";

class userPaymentMethodDal {


    /**
     * Create user payment methods.
     * Verifies the trading password and OTP before creating a payment method.
     * 
     * @param payload - The data required to create the user payment method. 
     * Should include user ID, payment method details, passcode, and OTP.
     * 
     * @returns A Promise that resolves to the created user payment method object.
     * @throws Will throw an error if the trading password is incorrect or OTP validation fails.
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
     * Get user payment methods by user ID.
     * 
     * @param payload - The user ID to retrieve payment methods for.
     * 
     * @returns A Promise that resolves to an array of user payment methods, or an empty array if none exist.
     * @throws Will throw an error if the retrieval process fails.
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
     * Remove a user payment method by its ID.
     * 
     * @param payload - The ID of the user payment method to be removed.
     * 
     * @returns A Promise that resolves to the result of the deletion operation.
     * @throws Will throw an error if the deletion process fails.
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
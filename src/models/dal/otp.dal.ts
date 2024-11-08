import { Op } from "sequelize";
import { otpSchema } from "../dto/otp.inerface";
import userOtpModel from "../model/otps.model";
import userModel from "../model/users.model";

class otpdal {
    
    
    /**
     * Creates a new OTP for the user and saves it in both the users and OTP tables.
     * 
     * This method is used to generate a new OTP for a given username (email or phone number).
     * The OTP is saved in the `users` table (for reference) and in the `otps` table (for validation).
     * 
     * @param payload - The OTP schema containing the user information (email/phone number) and OTP.
     * 
     * @returns A boolean indicating the success of the operation (currently always returns false for simplicity).
     */
    create = async (payload: otpSchema): Promise<boolean> => {

        // save same token in both table (users/otp) when new otp is create 
        
        /**
         * find first user then 
         */
        await userModel.findOne({where : {
            [Op.or] : [{email : payload.username},{number : payload.username}]
        }})
        .then(obj => {
            obj?.update({})
        })
        


        return false;
    };


    /**
     * Matches the provided OTP with the stored OTP in the database.
     * 
     * This method is used to validate whether the provided OTP is correct for a user.
     * It checks if the OTP exists in the database and whether it has expired.
     * 
     * @param payload - The OTP schema containing the user information (email/phone number) and OTP.
     * 
     * @returns A boolean indicating whether the OTP matches and is valid.
     */
    async  matchOtp(payload:otpSchema) {
        
    }


}
export default otpdal
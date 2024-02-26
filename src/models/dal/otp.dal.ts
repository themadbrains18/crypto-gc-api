import { Op } from "sequelize";
import { otpSchema } from "../dto/otp.inerface";
import userOtpModel from "../model/otps.model";
import userModel from "../model/users.model";

class otpdal {
    
    /**
     * 
     * @param payload 
     * @returns 
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
     * 
     * @param params 
     */
    async  matchOtp(payload:otpSchema) {
        
    }


}
export default otpdal
import BaseController from "../../controllers/main.controller";
import profileModel, { profileInput, profileOuput } from "../model/profile.model";

class profileDal extends BaseController {


    /**
     * Create or update a user profile.
     * 
     * This method checks if the user profile exists:
     * - If the profile exists, it updates the profile with the provided data.
     * - If the profile does not exist, it creates a new one.
     * 
     * It also checks if the provided username (`uName`) is already taken by another user.
     * 
     * @param payload - The profile details to be created or updated.
     * 
     * @returns A Promise that resolves to the created or updated profile, or an error message if the username is already taken.
     * @throws Will throw an error if the creation or update fails.
     */
    async profileCreate(payload: profileInput): Promise<profileOuput | any> {
        try {
            let profile = await profileModel.findOne({ where: { user_id: payload.user_id }, raw: true });

            // console.log(payload,'==payload');
            

            let username = await profileModel.findOne({
                where: {
                    uName: payload.uName
                },
                raw: true

            });
            // console.log(username,'==username');



            if (username && (username?.uName!==payload.uName || username.user_id!== payload?.user_id)) {
                
                return {status: false,message:"Username is already taken"};
            }
            else{

                if (profile) {
    
                    let response = await profileModel.update(payload, { where: { user_id: payload.user_id } });
                    if (response) {
                        profile = await profileModel.findOne({ where: { user_id: payload.user_id }, raw: true });
                    }
                }
                else {
                    profile = await profileModel.create(payload);
                }
    
                return profile;
            }


        } catch (error: any) {

        }
    }

    /**
     * Create or update a user's profile picture (DP).
     * 
     * This method checks if the profile exists:
     * - If the profile exists, it updates the profile picture (`image` field).
     * - If the profile does not exist, it creates a new profile with the provided profile picture.
     * 
     * @param payload - The user profile data, including the profile picture (image) to be created or updated.
     * 
     * @returns A Promise that resolves to the updated profile with the new profile picture, or creates a new profile if it doesn't exist.
     * @throws Will throw an error if the creation or update fails.
     */
    async profileDPCreate(payload: any): Promise<profileOuput | any> {
        try {

            let profile = await profileModel.findOne({ where: { user_id: payload.user_id }, raw: true });

            if (profile) {
                let response = await profileModel.update({ image: payload.image }, { where: { user_id: payload.user_id } });
                if (response) {
                    profile = await profileModel.findOne({ where: { user_id: payload.user_id }, raw: true });
                }
            }
            else {
                profile = await profileModel.create(payload);
            }

            return profile;

        } catch (error: any) {
            return error
        }
    }
}

export default new profileDal();
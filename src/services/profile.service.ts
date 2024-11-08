import { lastLoginModel } from "../models";
import { kycModel, userModel } from "../models";
import profileDal from "../models/dal/profile.dal";
import { lastLoginOuput } from "../models/model/lastLogin.model";
import profileModel, { profileInput, profileOuput } from "../models/model/profile.model";

class profileServices {

     /**
     * Creates a new user profile.
     * 
     * This method is responsible for creating a new user profile by using the provided `profileInput` payload.
     * It interacts with the `profileDal.profileCreate` function to store the profile details in the database.
     * 
     * @param {profileInput} payload - The profile data to be saved.
     * @returns {Promise<profileOuput | object>} The created profile details or an object indicating failure.
     */

    async create(payload: profileInput): Promise<profileOuput | object> {
        return await profileDal.profileCreate(payload);
    }

    /**
     * Retrieves the profile of a specific user.
     * 
     * This method fetches a user's profile details using their `user_id`. It retrieves the user's profile information 
     * along with related KYC (Know Your Customer) details. The method uses Sequelize's `include` to join the `userModel`
     * and `kycModel` to provide detailed information. It excludes sensitive fields such as `password` and `TwoFA`.
     * 
     * @param {string} user_id - The ID of the user whose profile is being fetched.
     * @returns {Promise<profileOuput | any>} The user's profile details or an error message if not found.
     */
    async getProfile(user_id: string): Promise<profileOuput | any> {
        let apiStatus = await profileModel.findOne({
            where: { user_id: user_id },
            include: [{
                model: userModel,
                include: [
                    { model: kycModel }
                ],
                attributes: {
                    exclude: [
                        "password",
                        "deletedAt",
                        "cronStatus",
                        "updatedAt",
                        "UID",
                        "antiphishing",
                        "registerType",
                        "statusType",
                        "TwoFA",
                        "otpToken", "own_code",
                        "refeer_code", "secret"
                    ],
                }
            }]
        });
        if (apiStatus) {
            return apiStatus
        }
        else {
            return { messgae: 'Profile information not updated!!' }
        }
    }

    /**
     * Retrieves the activity log of a specific user.
     * 
     * This method fetches the user's login activity by their `user_id`. The results are ordered by the most recent login 
     * and are paginated using `offset` and `limit` to manage the result set size. The method also returns the total number 
     * of activity logs available for the user.
     * 
     * @param {string} user_id - The ID of the user whose login activity is being fetched.
     * @param {string} offset - The offset (pagination) starting point for the query.
     * @param {string} limit - The limit (pagination) on the number of records returned.
     * @returns {Promise<lastLoginOuput | any>} The user's login activity or an error message if not found.
     */
    async getActivity(user_id: string, offset: string, limit: string): Promise<lastLoginOuput | any> {
        let activity = await lastLoginModel.findAll({ where: { user_id: user_id }, raw: true, order: [['createdAt', 'DESC']], offset: Number(offset), limit: Number(limit) });
        if (activity) {
            const totalLength = await lastLoginModel.count({ where: { user_id: user_id } });
            return { data: activity, totalLength: totalLength };
        }
        else {
            return { messgae: 'Activity information not updated!!' }
        }
    }

    /**
     * Saves the user's profile picture.
     * 
     * This method allows users to upload and save their profile picture (DP). It processes the provided payload 
     * and interacts with the `profileDal.profileDPCreate` function to store the profile picture in the database.
     * 
     * @param {any} payload - The profile picture data to be saved.
     * @returns {Promise<profileOuput | object>} The updated profile details or an object indicating failure.
     */
    async saveDp(payload: any): Promise<profileOuput | object> {

        return await profileDal.profileDPCreate(payload);
    }
}

export default profileServices;
import { lastLoginModel } from "../models";
import { kycModel, userModel } from "../models";
import profileDal from "../models/dal/profile.dal";
import { lastLoginOuput } from "../models/model/lastLogin.model";
import profileModel, { profileInput, profileOuput } from "../models/model/profile.model";

class profileServices {

    async create(payload: profileInput): Promise<profileOuput | object> {
        return await profileDal.profileCreate(payload);
    }

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
    async getActivity(user_id: string): Promise<lastLoginOuput | any> {
        let activity = await lastLoginModel.findAll({ where: { user_id: user_id }, raw: true });
        if (activity) {
            return activity
        }
        else {
            return { messgae: 'Activity information not updated!!' }
        }
    }

    async saveDp(payload: any): Promise<profileOuput | object> {

        return await profileDal.profileDPCreate(payload);
    }
}

export default profileServices;
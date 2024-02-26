import BaseController from "../../controllers/main.controller";
import profileModel, { profileInput, profileOuput } from "../model/profile.model";

class profileDal extends BaseController {
    async profileCreate(payload: profileInput): Promise<profileOuput | any> {
        try {
            let profile = await profileModel.findOne({ where: { user_id: payload.user_id }, raw: true });

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

        } catch (error: any) {

        }
    }

    async profileDPCreate(payload: any): Promise<profileOuput | any> {
        try {

            let profile = await profileModel.findOne({ where: { user_id: payload.user_id }, raw: true });

            if (profile) {
                let response = await profileModel.update({image : payload.image}, { where: { user_id: payload.user_id } });
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
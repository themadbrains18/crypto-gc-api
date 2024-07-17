import userNotificationModel, { userNotificationOuput } from "../model/user_notification.model";
import BaseController from "../../controllers/main.controller";
import { userNotificationDto } from "../dto/user_notification.dto";

class userNotificationDal extends BaseController {

    /**
     * 
     * @param payload 
     * @returns 
     */
    async createUserNotification(payload: userNotificationDto): Promise<userNotificationOuput | any> {

        try {
            return await userNotificationModel.create(payload);

        } catch (error) {
            console.log(error);
        }
    }

    async getNotifications(user_id : string): Promise<userNotificationOuput | any> {

        try {
            return await userNotificationModel.findAll(
                {where  :{user_id : user_id}, raw : true}
            );

        } catch (error) {
            console.log(error);
        }
    }
    // async function getNotifications(user_id : string):  Promise<userNotificationOuput | any> {
    //     try {
    //         const notifications = await userNotificationModel.findAll({
    //             where: { user_id: user_id },
    //             attributes: ['user_name'], // Include only the user name
    //             raw: true
    //         });
    //         return notifications;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

}

export default new userNotificationDal();
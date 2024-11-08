import userNotificationModel, { userNotificationOuput } from "../model/user_notification.model";
import BaseController from "../../controllers/main.controller";
import { userNotificationDto } from "../dto/user_notification.dto";

class userNotificationDal extends BaseController {


    /**
     * Creates a new user notification.
     * 
     * This method receives a payload containing details for creating a user notification
     * and persists it in the database. It returns the newly created notification or 
     * an error if the creation fails.
     * 
     * @param {userNotificationDto} payload - The data transfer object containing the notification details.
     * @returns {Promise<userNotificationOuput | any>} The newly created notification or an error object if the creation fails.
     * @throws {Error} Throws an error if the creation fails.
     */
    async createUserNotification(payload: userNotificationDto): Promise<userNotificationOuput | any> {

        try {
            return await userNotificationModel.create(payload);

        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Retrieves a list of notifications for a specific user.
     * 
     * This method fetches the notifications associated with a user based on the user ID 
     * and returns them in raw format. It helps retrieve all notifications for a user.
     * 
     * @param {string} user_id - The ID of the user whose notifications are to be retrieved.
     * @returns {Promise<userNotificationOuput | any>} A list of notifications associated with the user or an error object if retrieval fails.
     * @throws {Error} Throws an error if the retrieval fails.
     */
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
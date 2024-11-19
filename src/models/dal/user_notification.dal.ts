import userNotificationModel, { userNotificationOuput } from "../model/user_notification.model";
import BaseController from "../../controllers/main.controller";
import { userNotificationDto } from "../dto/user_notification.dto";
import profileModel from "../model/profile.model";

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

    async getNotifications(user_id: string): Promise<any> {
        try {
            // Fetch notifications for the user
            const notifications = await userNotificationModel.findAll({
                where: { user_id: user_id },
                raw: true,
            });
    
            // Extract `from.id` from the `message` object and fetch `fName` from profileModel
            const enrichedNotifications = await Promise.all(
                notifications.map(async (notification) => {
                    // Parse the message JSON to get `from.id`
                    // const message = JSON.parse(notification?.message as object);
                    // console.log(notification?.message,typeof notification?.message,"===notification?.message");
                    const message = notification.message as Record<string, any>;
                    const fromId = message?.from;
    
                    if (fromId) {
                        // Fetch the `fName` from profileModel
                        const profile = await profileModel.findOne({
                            where: { user_id: fromId },
                            attributes: ['dName'],
                            raw: true,
                        });
    
                        // Attach `fName` to the notification
                        return {
                            ...notification,
                            fromName: profile?.dName || null,
                        };
                    }
    
                    // Return the notification as-is if `from.id` is missing
                    return {
                        ...notification,
                        fromName: null,
                    };
                })
            );
    
            return enrichedNotifications;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching notifications');
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
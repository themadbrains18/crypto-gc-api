import { userNotificationDto } from "../models/dto/user_notification.dto";
import userNotificationModel, { userNotificationOuput } from "../models/model/user_notification.model";
import user_notificationDal from "../models/dal/user_notification.dal";

class userNotificationService{
  /**
     * Create a new user notification
     * 
     * @param payload - Notification data for the user
     * @returns The created notification object or an error
     */
    async create(payload : userNotificationDto) : Promise<userNotificationOuput | any>{
        return await user_notificationDal.createUserNotification(payload);
    }

    /**
     * Get notifications for a specific user
     * 
     * @param user_id - The ID of the user whose notifications are being fetched
     * @returns A list of user notifications or an error
     */
    async get(user_id : string) : Promise<userNotificationOuput | any>{
        return await user_notificationDal.getNotifications(user_id);
    }

    /**
     * Update the status of a specific notification
     * 
     * @param user_id - The ID of the user who owns the notification
     * @param id - The ID of the notification to update
     * @returns The updated notification or an error
     */
    async update(user_id : string, id : string) : Promise<userNotificationOuput | any>{
        
        return await userNotificationModel.update({status : true}, {where : {id: id, user_id : user_id}});
    }

}

export default userNotificationService;
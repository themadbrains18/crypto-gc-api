import { userNotificationDto } from "../models/dto/user_notification.dto";
import userNotificationModel, { userNotificationOuput } from "../models/model/user_notification.model";
import user_notificationDal from "../models/dal/user_notification.dal";

class userNotificationService{
    /**
     * 
     * @param payload 
     * @returns 
     */
    async create(payload : userNotificationDto) : Promise<userNotificationOuput | any>{
        return await user_notificationDal.createUserNotification(payload);
    }

    async get(user_id : string) : Promise<userNotificationOuput | any>{
        return await user_notificationDal.getNotifications(user_id);
    }

    async update(user_id : string, id : string) : Promise<userNotificationOuput | any>{
        
        return await userNotificationModel.update({status : true}, {where : {id: id, user_id : user_id}});
    }

}

export default userNotificationService;
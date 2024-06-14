import { NextFunction, Request, Response } from "express";
import BaseController from "./main.controller";
import service from "../services/service";
import { userNotificationDto } from "../models/dto/user_notification.dto";

class userNotificationController extends BaseController {

    protected async executeImpl(
        req: Request,
        res: Response
    ): Promise<void | any> {
        try {
            // ... Handle request by creating objects
        } catch (error: any) {
            return super.fail(res, error.toString());
        }
    }
    // =============================================================
    // save user notification 
    // =============================================================

    async saveUserNotification(wss: any, ws: any, body: any) {
        try {
            let notify: userNotificationDto = body;

            let notifyResponse = await service.notify.create(notify);

            if (notifyResponse) {
                wss.clients.forEach(function e(client: any) {
                    if (client.readyState === ws.OPEN){
                        client.send(JSON.stringify({ status: 200, data: [], type: 'user_notify' }));
                    }
                })
            }

        } catch (error) {
            ws.send(JSON.stringify({ status: 500, data: error }))
        }
    }

    // =============================================================
    // get user notification 
    // =============================================================
    async getNotification(req: Request, res: Response) {
        try {
            
            let notifications = await service.notify.get(req.params.id);

            super.ok<any>(res, notifications);
        } catch (error: any) {
            return super.fail(res, error.message);
        }
    }

    // =============================================================
    // update user notification status as read
    // =============================================================
    async updateNotification(req: Request, res: Response) {
        try {
            let notifications = await service.notify.update(req.body.userid, req.body.id);

            super.ok<any>(res, notifications);
        } catch (error: any) {
            return super.fail(res, error.message);
        }
    }
}

export default userNotificationController;
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

    /**
     * @description Saves a user notification and sends the notification data to connected WebSocket clients.
     * @param wss - The WebSocket server instance.
     * @param ws - The WebSocket client instance.
     * @param body - The notification data to save.
     * @returns {Promise<void>} - A promise that resolves when the operation is complete.
     */
    async saveUserNotification(wss: any, ws: any, body: any) {
        try {
            let notify: userNotificationDto = body;

            let notifyResponse = await service.notify.create(notify);

            if (notifyResponse) {
                wss.clients.forEach(function e(client: any) {
                    client.send(JSON.stringify({ status: 200, data: [], type: 'user_notify' }));
                })
            }

        } catch (error) {
            ws.send(JSON.stringify({ status: 500, data: error }))
        }
    }


    /**
     * @description Retrieves notifications for a user.
     * @param req - The request object containing user id in the URL parameters.
     * @param res - The response object to send the notifications.
     * @returns {Promise<void>} - A promise that resolves when the response is sent.
     */
    async getNotification(req: Request, res: Response) {
        try {
            
            let notifications = await service.notify.get(req.params.id);

            super.ok<any>(res, notifications);
        } catch (error: any) {
            return super.fail(res, error.message);
        }
    }


    /**
     * @description Marks a user notification as read.
     * @param req - The request object containing user id and notification id in the body.
     * @param res - The response object to return the update status.
     * @returns {Promise<void>} - A promise that resolves when the response is sent.
     */
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
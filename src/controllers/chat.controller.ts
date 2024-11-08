import { Response, Request } from "express";
import BaseController from "./main.controller";
import { P2PchatDto } from "../models/dto/chat.dto";
import service from "../services/service";

class chatController extends BaseController {
  protected async executeImpl(
    req: Request,
    res: Response
  ): Promise<void | any> {
    try {
      // ... Handle request by creating objects
    } catch (error: any) {
      return this.fail(res, error.toString());
    }
  }
 /**
   * Creates a new chat message.
   * @param {Request} req - Express request object containing message data in body.
   * @param {Response} res - Express response object.
   */
  async create(req: Request, res: Response) {
    try {

      let chat: P2PchatDto = req.body;

      let chatResponse = await service.chat.create(chat);

      super.ok<any>(res, { message: "Message send successfully", result: chatResponse });

    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   * Retrieves the chat list for a given order ID.
   * @param {Request} req - Express request object with order ID in params.
   * @param {Response} res - Express response object.
   */
  async getChat(req: Request, res: Response) {
    try {

      let chatResponse = await service.chat.chatList(req.params.orderid);

      super.ok<any>(res, chatResponse);

    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
   * Retrieves notifications for the chat (currently a stubbed response).
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   */
  getNotification(req: Request, res: Response): void {
    try {
      res.send(200).send("getNotification");
    } catch (e) {
      res.send(400).send("getChat");
    }
  }

  /**
   * Changes the notification status (currently a stubbed response).
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   */
  changeNotificationStatus(req: Request, res: Response): void {
    try {
      res.send(200).send("changeNotificationStatus");
    } catch (e) {
      res.send(400).send("changeNotificationStatus");
    }
  }

 /**
   * Sends real-time chat data to all connected WebSocket clients for a given order ID.
   * @param {any} wss - WebSocket server instance.
   * @param {any} ws - WebSocket connection instance for the current client.
   * @param {object} body - Object containing order information.
   */
  async socketChat(wss: any, ws : any, body : any) {
    try {
      if (body?.orderid === undefined || body?.orderid === "") return
      let data = await await service.chat.chatList(body?.orderid);

      wss.clients.forEach(function e(client:any) {
        client.send(JSON.stringify({ status: 200, data: data, type: 'chat' }));
      })
    } catch (error) {
      ws.send(JSON.stringify({ status: 500, data: error }))
    }
  }
}

export default chatController;

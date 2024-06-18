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
   *
   * @param req
   * @param res
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
   *
   * @param req
   * @param res
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
   *
   * @param req
   * @param res
   */
  getNotification(req: Request, res: Response): void {
    try {
      res.send(200).send("getNotification");
    } catch (e) {
      res.send(400).send("getChat");
    }
  }

  /**
   *
   * @param req
   * @param res
   */
  changeNotificationStatus(req: Request, res: Response): void {
    try {
      res.send(200).send("changeNotificationStatus");
    } catch (e) {
      res.send(400).send("changeNotificationStatus");
    }
  }

  /**
   *
   * @param req
   * @param res
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

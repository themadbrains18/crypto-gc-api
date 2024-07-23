import { Response, Request, response } from "express";
import BaseController from "./main.controller";
import P2POrderDto from "../models/dto/p2porder.dto";
import service from "../services/service";
import { orderModel, postModel, userModel } from "../models";
import { Op } from "sequelize";
import profileModel from "../models/model/profile.model";
import pusher from "../utils/pusher";

class orderController extends BaseController {
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
   */
  async create(req: Request, res: Response) {
    try {

      let p2pOrder: P2POrderDto = req.body;

      let p2pResponse = await service.p2p.createOrder(p2pOrder);

      let user = await userModel.findOne({
        where: { id: p2pResponse.buy_user_id },
        raw: true,
      });

      let seller = await profileModel.findOne({ 
        where: { user_id: p2pResponse.sell_user_id },
        raw: true,
      });

      let sellerName = seller?.fName || "" + seller?.lName || '';
      let spend = p2pResponse.spend_amount + ' ' + p2pResponse.spend_currency;

      const emailTemplate = service.emailTemplate.p2pBuyEmail(
        p2pResponse.post_id,
        spend,
        sellerName,
        // '',
        p2pResponse.receive_amount + p2pResponse.receive_currency
      );

      service.emailService.sendMail(req.headers["X-Request-Id"], {
        to: user?.email || '',
        subject: "P2P Buy Order Confirmation",
        html: emailTemplate.html,
      });

      pusher.trigger("crypto-channel", "p2p", {
        message: "hello world", data : p2pResponse
      })

      super.ok<any>(res, { message: 'P2P order create successfully!!.', result: p2pResponse });

    } catch (error: any) {
      super.fail(res, error.message);
    }
  }


  /**
  * P2P Order canceled by user
  */
  async cancelOrder(req: Request, res: Response) {
    try {
      // console.log('=========order cancel 1');
      let cancelOrderResponse = await service.p2p.cancelOrder(req.body);

      super.ok<any>(res, { message: 'Order cancel successfully!!.', result: cancelOrderResponse });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }


  /**
  * Update order status to complete from buyer when he paid payment.
  */
  async updateOrder(req: Request, res: Response) {
    try {
      let orderRepsonse = await service.p2p.updateOrder(req.body);

      super.ok<any>(res, { message: "Order status updated successfully!!", result: orderRepsonse })
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }


  /**
  * 
  */
  async releaseOrder(req: Request, res: Response) {
    try {
      let releaseReponse = await service.p2p.orderReleased(req.body);

      super.ok<any>(res, { message: "Order release successfully!!.", result: releaseReponse });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }


  /**
  * 
  */
  async getOrderList(req: Request, res: Response) {
    try {

      let orderResponse = await service.p2p.getOrderList(req.params.userid);
      super.ok<any>(res, orderResponse);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
  /**
  * 
  */
  async getOrderListByLimit(req: Request, res: Response) {
    try {
      let { offset, limit } = req.params
      let orderResponse = await service.p2p.getOrderList(req.params.userid);
      let orderpaginate = await service.p2p.getOrderListByLimit(req.params.userid, offset, limit);
      super.ok<any>(res, { data: orderpaginate, total: orderResponse.length });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
  /**
  * 
  */
  async getOrderListByStatusByLimit(req: Request, res: Response) {
    try {
      let { status, offset, limit,currency, date } = req.params
      let orderResponse = await service.p2p.getOrderList(req.params.userid);
      let orderpaginate = await service.p2p.getOrderListByStatusByLimit(req.params.userid,status, offset, limit, currency,date);
      super.ok<any>(res,  orderpaginate);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

  /**
  * 
  */
  async getAllOrderList(req: Request, res: Response) {
    try {
      let orderResponse = await service.p2p.getAllOrderList();
      super.ok<any>(res, orderResponse);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
  /**
  * 
  */
  async getAllOrderListByLimit(req: Request, res: Response) {
    try {

      const { offset, limit } = req?.params
      let orderResponse = await service.p2p.getAllOrderList();
      let orderResponsePaginated = await service.p2p.getAllOrderListByLimit(offset, limit);
      super.ok<any>(res, { data: orderResponsePaginated, total: orderResponse?.length });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }


  /**
  * 
  */
  async getOrderById(req: Request, res: Response) {
    try {
      let userid = req.body.user_id;
      let orderResponse = await service.p2p.getOrderByid(req.params.orderid, userid);

      super.ok<any>(res, orderResponse);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }


  /**
  * 
  */
  slugverify(req: Request, res: Response) { }


  /**
  * 
  */
  async socketOrder(wss: any, ws: any, body: any) {
    try {

      if (body?.orderid === undefined || body?.orderid === "") return
      let data = await service.p2p.getOrderByid(body.orderid, body?.user_id);

      wss.clients.forEach(function e(client: any) {
        client.send(JSON.stringify({ status: 200, data: data, type: 'order' }));
      })

    } catch (error) {
      ws.send(JSON.stringify({ status: 500, data: error }))
    }
  }

  async updatePaymentMethod(req: Request, res: Response) {
    try {
      let ordder = await orderModel.findOne({ where: { id: req.body.order_id }, raw: true });

      if (ordder) {
        if (ordder.p_method !== '') {
          return super.fail(res, 'You already paid.');
        }
        let updateResponse = await orderModel.update({ p_method: req.body.p_method, status: 'isCompleted' }, { where: { id: req.body.order_id } });
        if (updateResponse) {
          ordder.p_method = req.body.p_method;
          return super.ok<any>(res, ordder);
        }
      }
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }


  async expressCreate(req: Request, res: Response) {
    try {

      let post = await postModel.findOne({ where: { quantity: { [Op.gt]: 2 }, token_id: '07bc93a7-6138-460c-af6f-139238178bfe', min_limit: { [Op.gt]: 100 }, status: true } });

      super.ok<any>(res, { message: 'P2P Express order create!!.', result: post });

    } catch (error: any) {
      super.fail(res, error.message);
    }
  }
}

export default orderController
import { Response, Request, response } from "express";
import BaseController from "./main.controller";
import P2POrderDto from "../models/dto/p2porder.dto";
import service from "../services/service";
import { orderModel, postModel, userModel } from "../models";
import { Op } from "sequelize";
import profileModel from "../models/model/profile.model";
import pusher from "../utils/pusher";
import AsyncLock from 'async-lock';

const lock = new AsyncLock();

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
   * Handles the request for creating a P2P order.
   * 
   * This method is responsible for creating a new P2P order, sending a confirmation email to the user, and locking the order creation process to avoid race conditions.
   * 
   * @param {Request} req - The Express request object, which contains the P2P order data in the body.
   * @param {Response} res - The Express response object, used to send back the response.
   * 
   * @returns {Promise<void>} - A promise that resolves when the order is created and the response is sent.
   * 
   * @throws {Error} - Throws an error if any operation within the method fails.
   */
  async create(req: Request, res: Response) {
    try {

      let p2pOrder: P2POrderDto = req.body;
      const key = `create-order-${p2pOrder.post_id}`;

      // console.log(key,'=================key');
      
      lock.acquire(key, async () => {
        try {
          let p2pResponse = await service.p2p.createOrder(p2pOrder);
          // console.log(p2pResponse, '==========P2p Response===========');

          if (p2pResponse) {
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

            // pusher.trigger("crypto-channel", "p2p", {
            //   message: "hello world", data : p2pResponse
            // })
          }
          super.ok<any>(res, { message: 'P2P order create successfully!!.', result: p2pResponse });
        } catch (error: any) {
          super.fail(res, error.message);
        }
      }, (err: any) => {
        if (err) {
          super.fail(res, err.message);
        }
      });
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }


  /**
   * Cancels a P2P order initiated by the user.
   * 
   * This method calls the cancelOrder service to handle the logic for cancelling an order.
   * 
   * @param {Request} req - The Express request object containing the order data in the body.
   * @param {Response} res - The Express response object to send the result back to the client.
   * 
   * @returns {Promise<void>} - A promise that resolves when the order is cancelled and the response is sent.
   * 
   * @throws {Error} - Throws an error if the cancellation fails.
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
   * Updates the status of a P2P order when the buyer has completed the payment.
   * 
   * This method updates the order status to "complete" when the buyer confirms the payment.
   * 
   * @param {Request} req - The Express request object containing the order status update data.
   * @param {Response} res - The Express response object to send the update result.
   * 
   * @returns {Promise<void>} - A promise that resolves when the order status is updated and the response is sent.
   * 
   * @throws {Error} - Throws an error if updating the order status fails.
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
   * Releases a P2P order after it has been confirmed.
   * 
   * This method is triggered when the buyer confirms the transaction, and the order is released.
   * 
   * @param {Request} req - The Express request object containing the release data.
   * @param {Response} res - The Express response object to send the result back to the client.
   * 
   * @returns {Promise<void>} - A promise that resolves when the order is released and the response is sent.
   * 
   * @throws {Error} - Throws an error if releasing the order fails.
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
   * Retrieves the list of orders for a specific user.
   * 
   * This method fetches all orders for the user specified by the `userid` parameter.
   * 
   * @param {Request} req - The Express request object containing the `userid` in the parameters.
   * @param {Response} res - The Express response object to send the order list.
   * 
   * @returns {Promise<void>} - A promise that resolves with the list of orders for the user.
   * 
   * @throws {Error} - Throws an error if fetching the orders fails.
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
   * Retrieves a paginated list of orders for a specific user.
   * 
   * This method fetches a limited set of orders for the user, with pagination based on the `offset` and `limit` parameters.
   * 
   * @param {Request} req - The Express request object containing the `userid`, `offset`, and `limit` in the parameters.
   * @param {Response} res - The Express response object to send the paginated order list.
   * 
   * @returns {Promise<void>} - A promise that resolves with the paginated list of orders.
   * 
   * @throws {Error} - Throws an error if fetching the paginated orders fails.
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
 * Retrieves a paginated list of orders for a user with a specific status.
 * 
 * This method fetches a list of orders for the user specified by `userid`, filtered by the given order status. Pagination is handled using the `offset` and `limit` parameters.
 * Additional filtering can be applied by specifying the `currency` and `date`.
 * 
 * @param {Request} req - The Express request object, which contains the `userid`, `status`, `offset`, `limit`, `currency`, and `date` in the request parameters.
 * @param {Response} res - The Express response object used to send the paginated list of orders back to the client.
 * 
 * @returns {Promise<void>} - A promise that resolves with the paginated list of orders filtered by the given status.
 * 
 * @throws {Error} - Throws an error if fetching or filtering the orders fails.
 */
  async getOrderListByStatusByLimit(req: Request, res: Response) {
    try {
      let { status, offset, limit, currency, date } = req.params
      let orderResponse = await service.p2p.getOrderList(req.params.userid);
      let orderpaginate = await service.p2p.getOrderListByStatusByLimit(req.params.userid, status, offset, limit, currency, date);
      super.ok<any>(res, orderpaginate);
    } catch (error: any) {
      super.fail(res, error.message);
    }
  }

/**
 * Retrieves all orders without any filtering.
 * 
 * This method fetches all orders in the system, regardless of status, user, or any other filter. It's useful for administrators or those needing to view all orders.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object used to send the list of all orders.
 * 
 * @returns {Promise<void>} - A promise that resolves with the list of all orders.
 * 
 * @throws {Error} - Throws an error if fetching the orders fails.
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
 * Retrieves a paginated list of all orders.
 * 
 * This method fetches all orders in the system but limits the number of orders returned using the `offset` and `limit` parameters for pagination.
 * It's useful for administrators or those needing to view large sets of orders in a paginated manner.
 * 
 * @param {Request} req - The Express request object containing the `offset` and `limit` for pagination.
 * @param {Response} res - The Express response object used to send the paginated list of orders.
 * 
 * @returns {Promise<void>} - A promise that resolves with the paginated list of all orders.
 * 
 * @throws {Error} - Throws an error if fetching the orders or paginating fails.
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
 * Retrieves details of a specific order by its ID.
 * 
 * This method fetches the details of a specific order, identified by its `orderid`, for the user specified by `user_id`. It is useful for users to view detailed information about a particular order.
 * 
 * @param {Request} req - The Express request object, which contains the `orderid` in the request parameters and `user_id` in the request body.
 * @param {Response} res - The Express response object used to send the order details.
 * 
 * @returns {Promise<void>} - A promise that resolves with the details of the specified order.
 * 
 * @throws {Error} - Throws an error if fetching the order details fails.
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
 * Handles WebSocket communication to send order data to all connected clients.
 * 
 * This method listens for incoming WebSocket messages containing an order ID and user ID. 
 * If a valid order ID is provided, it fetches the corresponding order details from the database and broadcasts the data 
 * to all connected WebSocket clients. The data is sent as a JSON message with a status of 200.
 * 
 * @param {any} wss - The WebSocket server instance to send data to all connected clients.
 * @param {any} ws - The WebSocket client instance that initiated the connection.
 * @param {any} body - The request body containing the `orderid` and `user_id` to identify the order and user.
 * 
 * @returns {void} - This method doesn't return any value. It sends data over the WebSocket connection to all clients.
 * 
 * @throws {Error} - If an error occurs while fetching order data or broadcasting, an error is sent to the WebSocket client.
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

  /**
 * Updates the payment method for a specified order.
 * 
 * This method checks if the order has already been paid (i.e., if the payment method is set). 
 * If it hasn't been paid, it updates the payment method and marks the order as completed. 
 * If the order is already paid, an error message is returned.
 * 
 * @param {Request} req - The Express request object, which contains the `order_id` and `p_method` in the request body.
 * @param {Response} res - The Express response object used to send the updated order details or an error message.
 * 
 * @returns {Promise<void>} - A promise that resolves with the updated order data if the payment method is successfully updated.
 * 
 * @throws {Error} - Throws an error if fetching or updating the order fails.
 */
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

/**
 * Creates a P2P Express order with specific conditions on post availability.
 * 
 * This method checks for posts that have a quantity greater than 2, a specific `token_id`, 
 * a `min_limit` greater than 100, and are active (`status: true`). If such a post is found, 
 * it responds with the post details, indicating that a P2P Express order can be created.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object used to send the post details or an error message.
 * 
 * @returns {Promise<void>} - A promise that resolves with a success message and post details if the order can be created.
 * 
 * @throws {Error} - Throws an error if fetching the post or creating the order fails.
 */
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
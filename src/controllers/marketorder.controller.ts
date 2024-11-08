  import { Request, Response } from "express";
  import BaseController from "./main.controller";
  import { marketDto } from "../models/dto/market.dto";
  import service from "../services/service";
  import { marketCancel, marketPartialExecution } from "../utils/interface";
  import pusher from "../utils/pusher";

  class marketOrderController extends BaseController {
      /**
   * Handle the execution of requests in the controller.
   * @param req - Express request object.
   * @param res - Express response object.
   */
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
   * Creates a new market order.
   * @param req - Express request object with order data.
   * @param res - Express response object.
   */
    async create(req: Request, res: Response) {
      try {

        let orderbody: marketDto = req.body;

        let marketResponsee = await service.market.create(orderbody);
        pusher.trigger("crypto-channel", "market", {
          message: "hello world"
        })
        super.ok<any>(res, { message: "Order create successfully!.", result: marketResponsee });

      } catch (error: any) {
        super.fail(res, error.message);
      }
    }

  /**
   * Retrieves all market orders by token.
   * @param req - Express request object with token ID.
   * @param res - Express response object.
   */
    async getAll(req: Request, res: Response) {
      try {

        let orderListResponse = await service.market.getListByTokenId(req.params.token);

        super.ok<any>(res, orderListResponse);
      } catch (error: any) {
        super.fail(res, error.message);
      }
    }
    /**
     * 
     */
    cronMarketBuySell(req: Request, res: Response) { }

  /**
   * Executes a partial market order (buy/sell).
   * @param req - Express request object with partial execution data.
   * @param res - Express response object.
   */
    async socketMarket(req: Request, res: Response) {
      try {

        let order: marketPartialExecution = req.body;
        let marketReaponse = await service.market.marketPartialOrder(order);
        pusher.trigger("crypto-channel", "market", {
          message: "hello world"
        })
        super.ok<any>(res, { result: marketReaponse });
      } catch (error: any) {
        super.fail(res, error.message);
      }
    }

  /**
   * Retrieves all orders by token and user ID.
   * @param req - Express request object with token ID and user ID.
   * @param res - Express response object.
   */
    async getAllOrders(req: Request, res: Response) {
      try {
        let orderListResponse = await service.market.getOrderListByTokenIdUserId(req.params.token, req.params.userid);
        super.ok<any>(res, orderListResponse);
      } catch (error: any) {
        super.fail(res, error.message);
      }
    }

  /**
   * Retrieves orders for a specific user.
   * @param req - Express request object with user ID.
   * @param res - Express response object.
   */
    async getorders(req: Request, res: Response) {
      try {
        let orderResponse = await service.market.getList(req.params.userid);

        super.ok<any>(res, orderResponse);
      } catch (error: any) {
        super.fail(res, error.message);
      }
    }

  /**
   * Retrieves orders for a specific user with pagination.
   * @param req - Express request object with user ID, offset, limit, currency, and date.
   * @param res - Express response object.
   */
    async getordersByLimit(req: Request, res: Response) {
      try {
            
        let { offset, limit, currency, date } = req?.params
        let orderResponse = await service.market.getList(req.params.userid);
        let orderPaginate = await service.market.getListByLimit(req.params.userid, offset, limit,currency,date);

        super.ok<any>(res,orderPaginate);
      } catch (error: any) {
        super.fail(res, error.message);
      }
    }

  /**
   * Cancels a market order.
   * @param req - Express request object with cancel order data.
   * @param res - Express response object.
   */
    async cancelOrders(req: Request, res: Response) {
      try {

        let ord: marketCancel = req.body;
        let cancelResponse = await service.market.cancelOrder(ord);
        pusher.trigger("crypto-channel", "market", {
          message: "hello world"
        })
        super.ok<any>(res, { message: "Order create successfully!.", result: cancelResponse });
      } catch (error: any) {
        super.fail(res, error.message);
      }
    }

  /**
   * Retrieves the order history by token and user ID.
   * @param req - Express request object with token ID and user ID.
   * @param res - Express response object.
   */
    async getAllOrdersHistory(req: Request, res: Response) {
      try {
        let orderListResponse = await service.market.getOrderHistoryByTokenIdUserId(req.params.token, req.params.userid);
        super.ok<any>(res, orderListResponse);
      } catch (error: any) {
        super.fail(res, error.message);
      }
    }
  /**
   * Retrieves all market orders.
   * @param req - Express request object.
   * @param res - Express response object.
   */
    async getAllMarketOrderList(req: Request, res: Response) {
      try {
        let orderListResponse = await service.market.getAllMarketOrder();
        super.ok<any>(res, orderListResponse);
      } catch (error: any) {
        super.fail(res, error.message);
      }
    }
  /**
   * Retrieves all market orders with pagination.
   * @param req - Express request object with offset and limit.
   * @param res - Express response object.
   */
    async getAllMarketOrderListByLimit(req: Request, res: Response) {
      try {
        let { offset, limit } = req?.params
        let orderListResponse = await service.market.getAllMarketOrder();
        let orderListResponsePaginate = await service.market.getAllMarketOrderByLimit(offset, limit);
        super.ok<any>(res, { data: orderListResponsePaginate, total: orderListResponse?.length });
      } catch (error: any) {
        super.fail(res, error.message);
      }
    }
 /**
   * Retrieves the order history (socket-based).
   * @param req - Express request object.
   * @param res - Express response object.
   */
    socketOrdersHistory(req: Request, res: Response) { }
  }

  export default marketOrderController
import { Request, Response, NextFunction } from "express";
import BaseController from "./main.controller";
import service from "../services/service";
import futureOpenOrderDto from "../models/dto/futureOpenOrder.dto";

class futureOpenOrderController extends BaseController {
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
     * Retrieves all open orders for a specific user.
     * @param {Request} req - Express request object with user ID in params.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next function.
     */
    async allOpenOrder(req: Request, res: Response, next: NextFunction) {
        try {
            let pairs = await service.openorder.all(req.params.userid);

            super.ok<any>(res, pairs);
        } catch (error: any) {
            next(error);
        }
    }

    /**
     * Retrieves paginated open orders.
     * @param {Request} req - Express request object with offset and limit in params.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next function.
     */
    async allOpenByLimit(req: Request, res: Response, next: NextFunction) {
        try {
            let { offset, limit } = req.params;
            // let pairs = await service.openorder.all();
            let pairsPaginate = await service.openorder.allByLimit(offset, limit);
            super.ok<any>(res, { data: pairsPaginate, total: 5 });
        } catch (error: any) {
            next(error);
        }
    }

    /**
     * Creates a new open order.
     * @param {Request} req - Express request object with order details in body.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next function.
     */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            let trade: futureOpenOrderDto = req.body;

            let orderResponse = await service.openorder.create(trade);
            if (orderResponse?.error) {
                return super.fail(res, orderResponse?.error);
            }
            super.ok<any>(res, {
                message: "Order position create successfully.",
                result: orderResponse,
                status: 200,
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    /**
     * Edits an existing open order.
     * @param {Request} req - Express request object with order details in body.
     * @param {Response} res - Express response object.
     * @param {NextFunction} next - Express next function.
     */
    async edit(req: Request, res: Response, next: NextFunction) {
        try {
            let trade: futureOpenOrderDto = req.body;

            let orderResponse = await service.openorder.edit(trade);
            if (orderResponse) {
                let trades = await service.openorder.all(req?.body?.user_id);
                return super.ok<any>(res, { trades, status: 200 });
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    /**
     * Deletes a specific open order by ID.
     * @param {Request} req - Express request object with order ID in params and user ID in body.
     * @param {Response} res - Express response object.
     */
    async deleteRequest(req: Request, res: Response) {
        try {

            let deleteResponse = await service.openorder.closeOpenOrderById(req?.params?.id, req?.body?.user_id);

            if (deleteResponse?.data === null) {
                super.ok<any>(res, {
                    message: deleteResponse?.message,
                    status: 404,
                });
            }
            super.ok<any>(res, {
                message: "open order close successfully.",
                result: deleteResponse,
                status: 200,
            });
        } catch (error: any) {
            super.fail(res, error.message)
        }
    }

    /**
     * Deletes all open orders for a user.
     * @param {Request} req - Express request object with user ID in body.
     * @param {Response} res - Express response object.
     */
    async deleteAllRequest(req: Request, res: Response) {
        try {

            let deleteResponse = await service.openorder.closeOpenOrders(req?.body?.user_id);

            if (deleteResponse?.data === null) {
                super.ok<any>(res, {
                    message: deleteResponse?.message,
                    status: 404,
                });
            }
            super.ok<any>(res, {
                message: "all open order close successfully.",
                result: deleteResponse,
                status: 200,
            });
        } catch (error: any) {
            super.fail(res, error.message)
        }
    }

    /**
     * Retrieves open order history for a specific user.
     * @param {Request} req - Express request object with user ID in params.
     * @param {Response} res - Express response object.
     */
    async history(req: Request, res: Response) {
        try {
            let openOrderHistory = await service.openorder.openOrderHistory(req.params?.userid);

            super.ok<any>(res, openOrderHistory);
        } catch (error: any) {
            super.fail(res, error.message);
        }
    }
}

export default futureOpenOrderController;

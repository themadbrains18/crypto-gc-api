import { Request, Response, NextFunction } from "express";
import BaseController from "./main.controller";
import service from "../services/service";
import profitLossDto from "../models/dto/profitloss.dto";

class profitLossController extends BaseController {
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
       * Creates a new trade position.
       * @param req - The request object containing trade details.
       * @param res - The response object.
       * @param next - The next middleware function to call if an error occurs.
       * @returns {Promise<void>} - A promise that resolves when the position is created.
       */
    async create(req: Request, res: Response, next: NextFunction) {
        try {

            let trade: profitLossDto = req.body;

            let orderResponse: any = await service.profitLossServices.create(trade);

            if (orderResponse?.message) {
                return super.fail(res, orderResponse?.message);
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
     * Fetches all orders for the user.
     * @param req - The request object containing the user ID.
     * @param res - The response object.
     * @param next - The next middleware function to call if an error occurs.
     * @returns {Promise<void>} - A promise that resolves with all orders.
     */
    async allOrder(req: Request, res: Response, next: NextFunction) {
        try {
            let orders = await service.profitLossServices.all(req?.body?.user_id);

            super.ok<any>(res, orders);
        } catch (error: any) {
            next(error);
        }
    }
    /**
     * Closes an open trade position.
     * @param req - The request object containing the position ID and user ID.
     * @param res - The response object.
     * @param next - The next middleware function to call if an error occurs.
     * @returns {Promise<void>} - A promise that resolves with the result of closing the position.
     */
    async close(req: Request, res: Response, next: NextFunction) {
        try {
            const position_id = req?.params?.id;
            const user_id = req?.body?.user_id;

            let resposne: any = await service.profitLossServices.close(position_id, user_id);
            if (resposne?.data === null) {
                super.ok<any>(res, {
                    message: resposne?.message,
                    status: 404,
                });
            }
            super.ok<any>(res, {
                message: "open order close successfully.",
                result: resposne,
                status: 200,
            });
            super.ok<any>(res, resposne);
        } catch (error: any) {
            next(error);
            // super.fail(res, error?.message);
        }
    }

}

export default profitLossController;

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
     *  /Users/baljeetsingh/dumps/Dump20230728
     * @param res
     * @param req
     */

    async allOpenOrder(req: Request, res: Response, next: NextFunction) {
        try {
            let pairs = await service.openorder.all(req.params.userid);

            super.ok<any>(res, pairs);
        } catch (error: any) {
            next(error);
        }
    }

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
     *
     * @param res
     * @param req
     */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            let trade: futureOpenOrderDto = req.body;

            let orderResponse = await service.openorder.create(trade);
            if (orderResponse?.error) {
                return super.fail(res, orderResponse?.error);
            }
            super.ok<any>(res, {
                message: "order postion create successfully.",
                result: orderResponse,
                status: 200,
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

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

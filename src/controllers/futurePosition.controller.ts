import { Request, Response, NextFunction } from "express";
import BaseController from "./main.controller";
import service from "../services/service";
import { futurePositionModel } from "../models";
import futurePositionDto from "../models/dto/futurePoistion.dto";

class futurePositionController extends BaseController {
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

    async allPositionOrder(req: Request, res: Response, next: NextFunction) {
        try {
            let pairs = await service.position.all(req.params.userid);

            super.ok<any>(res, pairs);
        } catch (error: any) {
            next(error);
        }
    }

    async allPositionByLimit(req: Request, res: Response, next: NextFunction) {
        try {
            let { offset, limit } = req.params;
            // let pairs = await service.position.all();
            let pairsPaginate = await service.position.allByLimit(offset, limit);
            super.ok<any>(res, { data: pairsPaginate, total: 4 });
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

            let trade: futurePositionDto = req.body;

            let orderResponse: any = await service.position.create(trade);
            
            if (orderResponse.message) {
               return super.fail(res, orderResponse.message);
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

    async edit(req: Request, res: Response, next: NextFunction) {
        try {
            let trade: futurePositionDto = req.body;

            let orderResponse = await service.position.edit(trade);
            if (orderResponse) {
                let trades = await service.future.all();
                return super.ok<any>(res, { trades, status: 200 });
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async deleteRequest(req: Request, res: Response) {
        try {

            let deleteResponse = await service.position.closePositionById(req?.params?.id, req?.body?.user_id);

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

    async closeAllPositionRequest(req: Request, res: Response) {
        try {

            let closeAllPositionResponse = await service.position.closeAllPositionByUser(req?.body?.user_id);

            super.ok<any>(res, closeAllPositionResponse);
        } catch (error: any) {
            super.fail(res, error.message);
        }
    }

    async history(req: Request, res: Response) {
        try {
            let positionHistory = await service.position.positionHistory(req.params?.userid);

            super.ok<any>(res, positionHistory);
        } catch (error: any) {
            super.fail(res, error.message);
        }
    }

    async getLastDayData(req: Request, res: Response) {
        try {
            let coinResponse = await service.position.coinLastData(req?.params?.coinid);

            super.ok<any>(res, coinResponse);
        } catch (error: any) {
            super.fail(res, error.message);
        }
    }

    async getorbookder(req: Request, res: Response) {
        try {
            let orderBookResponse = await service.position.orderbook(req?.params?.coinid);

            super.ok<any>(res, orderBookResponse);
        } catch (error: any) {
            super.fail(res, error.message);
        }
    }
}

export default futurePositionController;

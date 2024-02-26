import { Request, Response, response } from "express";
import BaseController from "./main.controller";
import watchlistDto from "../models/dto/watchlist.dto";
import service from "../services/service";
import { watchlistModel } from "../models";
import CryptoJS from "crypto-js";
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';

class watchlistController extends BaseController {
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
            let payload: watchlistDto = req.body;

            let network = await watchlistModel.findOne({ where: { token_id: payload.token_id, user_id: payload.user_id }, raw: true });

            if (!network) {
                let reponse = await service.watchlist.create(payload);
                if (response) {
                    super.ok<any>(res, reponse);
                }
            }
            else {
                super.ok<any>(res, { message: 'This token already in watch list' });
            }

        } catch (error: any) {
            super.fail(res, error.message);
        }
    }

    async all(req: Request, res: Response) {
        try {
            let result = await service.watchlist.listById(req.params.user_id);
            if (result) {
                super.ok<any>(res, result);
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }


    async encriypt(req: Request, res: Response) {
        try {

            let key: any = process.env.ENCRYPTION_KEY;
            let password = AES.encrypt(
                req.body.key,
                key
            ).toString();

            if (password) {
                super.ok<any>(res, { data: password });
            }

        } catch (error: any) {
            super.fail(res, error.message);
        }
    }

    async dcrypt(req: Request, res: Response) {
        try {

            let pass = await service.watchlist.decrypt(req.body.key);

            if (pass) {
                super.ok<any>(res, pass);
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

}

export default watchlistController;

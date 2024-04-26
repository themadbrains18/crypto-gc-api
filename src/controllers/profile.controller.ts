import { NextFunction, Request, Response } from "express";
import BaseController from "./main.controller";

import profileModel, { profileInput } from "../models/model/profile.model";
import service from "../services/service";

class profileController extends BaseController {
    protected async executeImpl(
        req: Request,
        res: Response
    ): Promise<void | any> {
        try {
            // ... Handle request by creating objects
        } catch (error: any) {
            return super.fail(res, error.toString());
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {

            let profile: profileInput = req.body;
            let response = await service.profile.create(profile);

            return super.ok<any>(res, response);

        } catch (error: any) {
            return super.fail(res, error.message);
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            let response = await service.profile.getProfile(req.body.user_id);

            return super.ok<any>(res, response);
        } catch (error: any) {
            return super.fail(res, error.message);
        }
    }

    async getActivity(req: Request, res: Response) {
        try {
            const {offset,limit} = req.params
            let response = await service.profile.getActivity(req.body.user_id,offset,limit);
            
            return super.ok<any>(res, response);
        } catch (error: any) {
            return super.fail(res, error.message);
        }
    }

    async savedp(req: Request, res: Response) {
        try {
            // const obj = JSON.parse(JSON.stringify(req.files));

            // for (let itm in obj) {
            //     req.body[itm] = obj[itm][0]?.filename;
            // }

            let response = await service.profile.saveDp(req.body);

            return super.ok<any>(res,response);

        } catch (error: any) {
            return super.fail(res, error.message)
        }
    }
}

export default profileController;
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

     /**
     * Create a new profile based on the provided input.
     * @param req - The request object containing the profile data.
     * @param res - The response object used to send the response.
     * @param next - The next middleware function to call in case of an error.
     * @returns {Promise<void>} - A promise that resolves when the profile is created.
     */   
    async create(req: Request, res: Response, next: NextFunction) {
        try {

            let profile: profileInput = req.body;
            let response = await service.profile.create(profile);

            return super.ok<any>(res, response);

        } catch (error: any) {
            return super.fail(res, error.message);
        }
    }
    /**
     * Retrieve a user's profile using their user ID.
     * @param req - The request object containing the user ID.
     * @param res - The response object used to send the profile data.
     * @returns {Promise<void>} - A promise that resolves with the user's profile data.
     */
    async getProfile(req: Request, res: Response) {
        try {
            let response = await service.profile.getProfile(req.body.user_id);

            return super.ok<any>(res, response);
        } catch (error: any) {
            return super.fail(res, error.message);
        }
    }
    /**
     * Retrieve the activity of a user, with optional pagination.
     * @param req - The request object containing user ID, offset, and limit for pagination.
     * @param res - The response object used to send the activity data.
     * @returns {Promise<void>} - A promise that resolves with the user's activity data.
     */
    async getActivity(req: Request, res: Response) {
        try {
            const {offset,limit} = req.params
            let response = await service.profile.getActivity(req.body.user_id,offset,limit);
            
            return super.ok<any>(res, response);
        } catch (error: any) {
            return super.fail(res, error.message);
        }
    }

     /**
     * Save a user's profile picture (DP).
     * @param req - The request object containing the profile picture file data.
     * @param res - The response object used to send the result of the save operation.
     * @returns {Promise<void>} - A promise that resolves when the profile picture is saved.
     */   
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
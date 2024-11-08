import { NextFunction, Request, Response } from "express";
import BaseController from "./main.controller";
import service from "../services/service";
import { referProgramInput } from "../models/model/refer_program.model";
import { referProgramInviteInput } from "../models/model/refer_program_invite.model";
import { updateReferProgramStatus } from "../utils/interface";

class referProgramController extends BaseController {
    /**
       * Save a new referral program.
       * @param req - The request object containing referral program data.
       * @param res - The response object.
       * @param next - The next middleware function.
       */
    async saveReferProgram(req: Request, res: Response, next: NextFunction) {
        try {
            let refer: referProgramInput = req.body;
            let referResponse = await service.refer.create(refer);
            super.ok<any>(res, { message: "Refer Program Added successfully!.", result: referResponse });

        } catch (error) {
            next(error);
        }
    }
    /**
     * Edit an existing referral program.
     * @param req - The request object containing updated referral program data.
     * @param res - The response object.
     * @param next - The next middleware function.
     */
    async editReferProgram(req: Request, res: Response, next: NextFunction) {
        try {
            let refer: referProgramInput = req.body;

            let referResponse = await service.refer.editProgram(refer);
            super.ok<any>(res, { message: "Refer Program Edit successfully!.", result: referResponse });

        } catch (error) {
            next(error);
        }
    }
    /**
     * Change the status of a referral program.
     * @param req - The request object containing the program ID and new status.
     * @param res - The response object.
     * @param next - The next middleware function.
     */
    async changeStatus(req: Request, res: Response, next: NextFunction) {
        try {
            let { id, status } = req.body;

            let data: updateReferProgramStatus = { id, status };

            let statusResponse = await service.refer.changeStatus(data);
            if (statusResponse) {
                let trades = await service.refer.getAllProgram();
                return super.ok<any>(res, trades);
            } else {
                super.fail(res, statusResponse);
            }
        } catch (error: any) {
            super.fail(res, error.message);
        }
    }
    /**
     * Save a new referral program invite.
     * @param req - The request object containing referral invite data.
     * @param res - The response object.
     * @param next - The next middleware function.
     */
    async saveReferProgramInvite(req: Request, res: Response, next: NextFunction) {
        try {

            let refer: referProgramInviteInput = req.body;

            let referResponse = await service.refer.createInvite(refer);

            super.ok<any>(res, { message: "Refer Program Invite Added successfully!.", result: referResponse });

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all referral programs with pagination.
     * @param req - The request object containing offset and limit for pagination.
     * @param res - The response object.
     * @param next - The next middleware function.
     */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {

            let { offset, limit } = req.params;
            let response = await service.refer.getAllProgram();
            let programPaginate = await service.refer.getProgramByLimit(offset, limit);
            if (response) {
                super.ok<any>(res, { data: programPaginate, total: response?.length });
            }
        } catch (error: any) {
            super.fail(res, error.message);
        }
    }

    /**
     * Get all active referral event programs.
     * @param req - The request object containing offset and limit for pagination.
     * @param res - The response object.
     * @param next - The next middleware function.
     */
    async getAllActiveEvent(req: Request, res: Response, next: NextFunction) {
        try {

            let { offset, limit } = req.params;
            let response = await service.refer.getActiveProgramEvent();
            if (response) {
                super.ok<any>(res, { data: response });
            }
        } catch (error: any) {
            super.fail(res, error.message);
        }
    }

    /**
     * Get a single referral event by its name.
     * @param req - The request object containing the event name in the parameters.
     * @param res - The response object.
     * @param next - The next middleware function.
     */
    async getSingleEvent(req: Request, res: Response, next: NextFunction) {
        try {
            let { name } = req.params;

            name = name.replaceAll("-", " ");
            let response = await service.refer.getSingleEvent(name);

            if (response) {
                super.ok<any>(res, response);
            }

        } catch (error: any) {
            super.fail(res, error.message);
        }
    }

}

export default referProgramController;
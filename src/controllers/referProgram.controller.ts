import { NextFunction, Request, Response } from "express";
import BaseController from "./main.controller";
import service from "../services/service";
import { referProgramInput } from "../models/model/refer_program.model";
import { referProgramInviteInput } from "../models/model/refer_program_invite.model";
import { updateReferProgramStatus } from "../utils/interface";

class referProgramController extends BaseController {
    /**
   * get user assets list here
   * @param req
   * @param res
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

    async editReferProgram(req: Request, res: Response, next: NextFunction) {
        try {
            let refer: referProgramInput = req.body;

            let referResponse = await service.refer.editProgram(refer);
            super.ok<any>(res, { message: "Refer Program Edit successfully!.", result: referResponse });

        } catch (error) {
            next(error);
        }
    }

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

    async saveReferProgramInvite(req: Request, res: Response, next: NextFunction) {
        try {

            let refer: referProgramInviteInput = req.body;

            let referResponse = await service.refer.createInvite(refer);

            super.ok<any>(res, { message: "Refer Program Invite Added successfully!.", result: referResponse });

        } catch (error) {
            next(error);
        }
    }

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

    async getSingleEvent(req: Request, res: Response, next: NextFunction) {
        try {
            let { name } = req.params;

            name = name.replaceAll("-"," ");
            let response = await service.refer.getSingleEvent(name);

            if(response){
                super.ok<any>(res, response);
            }

        } catch (error: any) {
            super.fail(res, error.message);
        }
    }

}

export default referProgramController;
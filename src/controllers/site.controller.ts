import { Request, Response, NextFunction } from "express";
import BaseController from "./main.controller";
import service from "../services/service";
import { updateSiteDownStatus } from "../utils/interface";
import siteMaintenanceDto from "../models/dto/sitemaintenance.dto";
import { tradePairModel } from "../models";

class siteController extends BaseController {
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

    async getSiteMaintenance(req: Request, res: Response, next: NextFunction) {
        try {
            let pairs = await service.site.all();

            super.ok<any>(res, pairs);
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
            let site: siteMaintenanceDto = req.body;

            let response = await service.site.create(site);

            super.ok<any>(res, response);

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // ===================================================================
    // Admin service api
    // ===================================================================

    /**
     *
     * @param res
     * @param req
     */
    async activeInactiveSite(req: Request, res: Response, next: NextFunction) {
        try {
            let { id, down_status } = req.body;
            let data: updateSiteDownStatus = { id, down_status };

            let response = await service.site.updateStatus(data);

            super.ok<any>(res, response);


        } catch (error: any) {
            super.fail(res, error.message);
        }
    }

    async edit(req: Request, res: Response, next: NextFunction) {
        try {
            let site: siteMaintenanceDto = req.body;


            //=======================================//
            // check if record Exist
            //=======================================//
            let exists = await service.site.checkExist(req?.body?.id);
            if (exists) {

                //=======================================//
                // Update record
                //=======================================//
                let response = await service.site.edit(site);
                
                super.ok<any>(res, site);
            }
            else {
                super.fail(res, 'No record found');
            }

        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default siteController;

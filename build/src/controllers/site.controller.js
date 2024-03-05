"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
class siteController extends main_controller_1.default {
    async executeImpl(req, res) {
        try {
            // ... Handle request by creating objects
        }
        catch (error) {
            return this.fail(res, error.toString());
        }
    }
    /**
     *  /Users/baljeetsingh/dumps/Dump20230728
     * @param res
     * @param req
     */
    async getSiteMaintenance(req, res, next) {
        try {
            let pairs = await service_1.default.site.all();
            super.ok(res, pairs);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     *
     * @param res
     * @param req
     */
    async create(req, res, next) {
        try {
            let site = req.body;
            let response = await service_1.default.site.create(site);
            super.ok(res, response);
        }
        catch (error) {
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
    async activeInactiveSite(req, res, next) {
        try {
            let { id, down_status } = req.body;
            console.log(id, "=mds");
            let data = { id, down_status };
            let response = await service_1.default.site.updateStatus(data);
            super.ok(res, response);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async edit(req, res, next) {
        try {
            let site = req.body;
            //=======================================//
            // check if record Exist
            //=======================================//
            let exists = await service_1.default.site.checkExist(req?.body?.id);
            if (exists) {
                //=======================================//
                // Update record
                //=======================================//
                let response = await service_1.default.site.edit(site);
                super.ok(res, site);
            }
            else {
                super.fail(res, 'No record found');
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = siteController;

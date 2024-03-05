"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
class referProgramController extends main_controller_1.default {
    /**
   * get user assets list here
   * @param req
   * @param res
   */
    async saveReferProgram(req, res, next) {
        try {
            let refer = req.body;
            let referResponse = await service_1.default.refer.create(refer);
            super.ok(res, { message: "Refer Program Added successfully!.", result: referResponse });
        }
        catch (error) {
            next(error);
        }
    }
    async editReferProgram(req, res, next) {
        try {
            let refer = req.body;
            let referResponse = await service_1.default.refer.editProgram(refer);
            super.ok(res, { message: "Refer Program Edit successfully!.", result: referResponse });
        }
        catch (error) {
            next(error);
        }
    }
    async changeStatus(req, res, next) {
        try {
            let { id, status } = req.body;
            let data = { id, status };
            let statusResponse = await service_1.default.refer.changeStatus(data);
            if (statusResponse) {
                let trades = await service_1.default.refer.getAllProgram();
                return super.ok(res, trades);
            }
            else {
                super.fail(res, statusResponse);
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async saveReferProgramInvite(req, res, next) {
        try {
            let refer = req.body;
            let referResponse = await service_1.default.refer.createInvite(refer);
            super.ok(res, { message: "Refer Program Invite Added successfully!.", result: referResponse });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            let { offset, limit } = req.params;
            let response = await service_1.default.refer.getAllProgram();
            let programPaginate = await service_1.default.refer.getProgramByLimit(offset, limit);
            if (response) {
                super.ok(res, { data: programPaginate, total: response?.length });
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async getAllActiveEvent(req, res, next) {
        try {
            let { offset, limit } = req.params;
            let response = await service_1.default.refer.getActiveProgramEvent();
            if (response) {
                super.ok(res, { data: response });
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async getSingleEvent(req, res, next) {
        try {
            let { name } = req.params;
            name = name.replaceAll("-", " ");
            let response = await service_1.default.refer.getSingleEvent(name);
            if (response) {
                super.ok(res, response);
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
}
exports.default = referProgramController;

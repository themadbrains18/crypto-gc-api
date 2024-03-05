"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
class profileController extends main_controller_1.default {
    async executeImpl(req, res) {
        try {
            // ... Handle request by creating objects
        }
        catch (error) {
            return super.fail(res, error.toString());
        }
    }
    async create(req, res, next) {
        try {
            let profile = req.body;
            let response = await service_1.default.profile.create(profile);
            return super.ok(res, response);
        }
        catch (error) {
            return super.fail(res, error.message);
        }
    }
    async getProfile(req, res) {
        try {
            let response = await service_1.default.profile.getProfile(req.body.user_id);
            return super.ok(res, response);
        }
        catch (error) {
            return super.fail(res, error.message);
        }
    }
    async getActivity(req, res) {
        try {
            let response = await service_1.default.profile.getActivity(req.body.user_id);
            return super.ok(res, response);
        }
        catch (error) {
            return super.fail(res, error.message);
        }
    }
    async savedp(req, res) {
        try {
            const obj = JSON.parse(JSON.stringify(req.files));
            for (let itm in obj) {
                req.body[itm] = obj[itm][0]?.filename;
            }
            let response = await service_1.default.profile.saveDp(req.body);
            return super.ok(res, response);
        }
        catch (error) {
            return super.fail(res, error.message);
        }
    }
}
exports.default = profileController;

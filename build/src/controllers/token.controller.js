"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
const models_1 = require("../models");
class tokenController extends main_controller_1.default {
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
    async tokenAll(req, res, next) {
        try {
            let tokens = await service_1.default.token.all();
            super.ok(res, tokens);
        }
        catch (error) {
            next(error);
        }
    }
    async futureTokenAll(req, res, next) {
        try {
            let tokens = await service_1.default.token.futureAll();
            super.ok(res, tokens);
        }
        catch (error) {
            next(error);
        }
    }
    async tokenAllWithLimit(req, res, next) {
        try {
            let { offset, limit } = req.params;
            // const pageInt = parseInt(page);
            // const limitInt = parseInt(limit);
            let tokens = await service_1.default.token.adminTokenAll();
            let paginatedData = await service_1.default.token.allWithLimit(offset, limit);
            // const offset = (pageInt - 1) * limitInt;
            // const paginatedData = tokens.slice(pageInt,limitInt);
            // console.log(paginatedData, "===jdjlskj");
            super.ok(res, { data: paginatedData, total: tokens.length });
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
    socketGetCoinList(req, res) { }
    /**
     *
     * @param res
     * @param req
     */
    async create(req, res, next) {
        try {
            const obj = JSON.parse(JSON.stringify(req.files));
            for (let itm in obj) {
                req.body[itm] =
                    "http://localhost:3000/tmbexchange/token/" + obj[itm][0]?.filename;
            }
            let token = req.body;
            //=======================================//
            // check token if already register
            //=======================================//
            let tokenConntractAlreadyRegister = await service_1.default.token.alreadyExist(token);
            let flag = false;
            if (tokenConntractAlreadyRegister.length > 0) {
                return super.fail(res, "Token contarct already registered.");
            }
            let tokenResponse = await service_1.default.token.create(token);
            super.ok(res, {
                message: "Token successfully registered.",
                result: tokenResponse,
            });
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
    async activeInactiveToken(req, res, next) {
        try {
            let { id, status } = req.body;
            let data = { id, status };
            let statusResponse = await service_1.default.token.changeStatus(data);
            if (statusResponse) {
                let tokens = await service_1.default.token.adminTokenAll();
                return super.ok(res, tokens);
            }
            else {
                super.fail(res, statusResponse);
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async stakeStatus(req, res, next) {
        try {
            let { id, status } = req.body;
            let data = { id, status };
            let statusResponse = await service_1.default.token.changeStakeStatus(data);
            if (statusResponse) {
                let tokens = await service_1.default.token.adminTokenAll();
                return super.ok(res, tokens);
            }
            else {
                super.fail(res, statusResponse);
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     * Admin token list all
     * @param req
     * @param res
     * @param next
     */
    async adminTokenAll(req, res, next) {
        try {
            let tokens = await service_1.default.token.adminTokenAll();
            super.ok(res, tokens);
        }
        catch (error) {
            next(error);
        }
    }
    async edit(req, res, next) {
        try {
            const obj = JSON.parse(JSON.stringify(req.files));
            for (let itm in obj) {
                req.body[itm] =
                    "http://localhost:3000/tmbexchange/token/" + obj[itm][0]?.filename;
            }
            let token = req.body;
            //=======================================//
            // check token if already register
            //=======================================//
            let tokenConntractAlreadyRegister = await service_1.default.token.alreadyExist(token);
            let flag = false;
            if (tokenConntractAlreadyRegister.length > 0) {
                let tokenResponse = await service_1.default.token.edit(token);
                if (tokenResponse) {
                    let tokens = await service_1.default.token.adminTokenAll();
                    return super.ok(res, tokens);
                }
                // super.ok<any>(res, { message: "Token successfully registered.", data: tokenResponse })
            }
            else {
                return super.fail(res, "Token contarct not registered. Please add new token.");
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async updateNetwork(req, res, next) {
        try {
            let token = await models_1.globalTokensModel.findOne({ where: { id: req.body?.id }, raw: true });
            if (token) {
                req.body.networks = JSON.parse(req.body.networks);
                let body = req.body;
                let updateResponse = await service_1.default.token.updateGlobalTokenNetwork(body);
                super.ok(res, updateResponse);
            }
            else {
                super.fail(res, 'Token not found');
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
}
exports.default = tokenController;

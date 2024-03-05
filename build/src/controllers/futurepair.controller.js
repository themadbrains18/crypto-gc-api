"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
const models_1 = require("../models");
class futureTradePairController extends main_controller_1.default {
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
    async allPairs(req, res, next) {
        try {
            let pairs = await service_1.default.future.all();
            super.ok(res, pairs);
        }
        catch (error) {
            next(error);
        }
    }
    async allPairsByLimit(req, res, next) {
        try {
            let { offset, limit } = req.params;
            let pairs = await service_1.default.future.all();
            let pairsPaginate = await service_1.default.future.allByLimit(offset, limit);
            super.ok(res, { data: pairsPaginate, total: pairs?.length });
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
            let trade = req.body;
            let tradePairExist = await models_1.futureTradePairModel.findOne({
                where: { coin_id: trade?.coin_id, usdt_id: trade?.usdt_id },
                raw: true,
            });
            if (tradePairExist) {
                return super.ok(res, {
                    message: "Pair already available",
                    result: tradePairExist,
                    status: 409,
                });
            }
            let pairResponse = await service_1.default.future.create(trade);
            super.ok(res, {
                message: "Trade Pair successfully registered.",
                result: pairResponse,
                status: 200,
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
    async activeInactivePair(req, res, next) {
        try {
            let { id, status } = req.body;
            let data = { id, status };
            let statusResponse = await service_1.default.future.changeStatus(data);
            if (statusResponse) {
                let trades = await service_1.default.future.all();
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
    async edit(req, res, next) {
        try {
            let trade = req.body;
            //=======================================//
            // check token if already register
            //=======================================//
            let tradePairAlreadyRegister = await service_1.default.future.alreadyExist(trade);
            if (tradePairAlreadyRegister) {
                let tradeResponse = await service_1.default.future.edit(trade);
                if (tradeResponse) {
                    let trades = await service_1.default.future.all();
                    return super.ok(res, { trades, status: 200 });
                }
                // super.ok<any>(res, { message: "Token successfully registered.", data: tokenResponse })
            }
            else {
                return super.fail(res, "Trade pair not registered. Please create new pair.");
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}
exports.default = futureTradePairController;

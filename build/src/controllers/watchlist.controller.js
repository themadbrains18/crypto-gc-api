"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
const models_1 = require("../models");
const aes_1 = __importDefault(require("crypto-js/aes"));
class watchlistController extends main_controller_1.default {
    async executeImpl(req, res) {
        try {
            // ... Handle request by creating objects
        }
        catch (error) {
            return this.fail(res, error.toString());
        }
    }
    /**
     *
     * @param req
     * @param res
     */
    async create(req, res) {
        try {
            let payload = req.body;
            let network = await models_1.watchlistModel.findOne({ where: { token_id: payload.token_id, user_id: payload.user_id }, raw: true });
            if (!network) {
                let reponse = await service_1.default.watchlist.create(payload);
                if (express_1.response) {
                    super.ok(res, reponse);
                }
            }
            else {
                super.ok(res, { message: 'This token already in watch list' });
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async all(req, res) {
        try {
            let result = await service_1.default.watchlist.listById(req.params.user_id);
            if (result) {
                super.ok(res, result);
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async encriypt(req, res) {
        try {
            let key = process.env.ENCRYPTION_KEY;
            let password = aes_1.default.encrypt(req.body.key, key).toString();
            if (password) {
                super.ok(res, { data: password });
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async dcrypt(req, res) {
        try {
            let pass = await service_1.default.watchlist.decrypt(req.body.key);
            if (pass) {
                super.ok(res, pass);
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = watchlistController;

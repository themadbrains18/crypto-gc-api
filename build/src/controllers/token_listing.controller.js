"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
class tokenListingController extends main_controller_1.default {
    async executeImpl(req, res) {
        try {
            // ... Handle request by creating objects
        }
        catch (error) {
            return this.fail(res, error.toString());
        }
    }
    async create(req, res) {
        try {
            const obj = JSON.parse(JSON.stringify(req.files));
            for (let itm in obj) {
                req.body[itm] = obj[itm][0]?.filename;
            }
            let token = req.body;
            token.status = false;
            let tokenResponse = await service_1.default.token_list.create(token);
            super.ok(res, { message: " Token list successfully!!.", result: tokenResponse });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async tokenList(req, res) {
        try {
            let tokenResponse = await service_1.default.token_list.getTokenList();
            super.ok(res, tokenResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async topGainerList(req, res) {
        try {
            let coinList = await fetch("https://http-api.livecoinwatch.com/coins/movers?currency=USD&range=delta.day&volume=500000", {
                method: "GET",
                headers: new Headers({
                    "content-type": "application/json",
                }),
            });
            let data = await coinList.json();
            super.ok(res, data.gainers);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
}
exports.default = tokenListingController;

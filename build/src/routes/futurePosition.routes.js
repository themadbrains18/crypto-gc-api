"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../middlewares/authController"));
const main_controller_1 = __importDefault(require("../controllers/main.controller"));
const futurePosition_validator_1 = __importDefault(require("../validators/futurePosition.validator"));
const futurePosition_controller_1 = __importDefault(require("../controllers/futurePosition.controller"));
class futurePostionRoutes extends main_controller_1.default {
    router = (0, express_1.Router)();
    constructor() {
        super();
        this.init();
    }
    init() {
        let tradePPosition = new futurePosition_controller_1.default();
        let middleware = new authController_1.default();
        this.router.get('/:userid', middleware.auth, tradePPosition.allPositionOrder);
        this.router.get('/:offset/:limit', middleware.auth, tradePPosition.allPositionByLimit);
        /**
         * Create new position
        **/
        this.router.post('/create', middleware.auth, super.Validator(futurePosition_validator_1.default.create), tradePPosition.create);
        /**
         * Edit trade position
        **/
        this.router.post('/edit', middleware.auth, super.Validator(futurePosition_validator_1.default.edit), tradePPosition.edit);
        /**
         * Close single single position
         */
        this.router.delete('/close/:id', middleware.auth, tradePPosition.deleteRequest);
        /**
         * Close All position
         */
        this.router.post('/close/all', middleware.auth, tradePPosition.closeAllPositionRequest);
        /**
         * Get user position history data
         */
        this.router.get('/all/history/:userid', middleware.auth, tradePPosition.history);
        this.router.get('/hloc/coindata/:coinid', tradePPosition.getLastDayData);
        this.router.get('/coin/orderbook/:coinid', tradePPosition.getorbookder);
    }
}
exports.default = new futurePostionRoutes().router;

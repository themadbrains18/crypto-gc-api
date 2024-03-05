"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const users_model_1 = __importDefault(require("../model/users.model"));
class otpdal {
    /**
     *
     * @param payload
     * @returns
     */
    create = async (payload) => {
        // save same token in both table (users/otp) when new otp is create 
        /**
         * find first user then
         */
        await users_model_1.default.findOne({ where: {
                [sequelize_1.Op.or]: [{ email: payload.username }, { number: payload.username }]
            } })
            .then(obj => {
            obj?.update({});
        });
        return false;
    };
    /**
     *
     * @param params
     */
    async matchOtp(payload) {
    }
}
exports.default = otpdal;

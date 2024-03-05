"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
class otpService {
    async match(data) {
        let userToken = await models_1.userModel.findOne({
            where: {
                [sequelize_1.Op.or]: [{ email: data.username }, { number: data.username }], //otp.username
            },
        });
        let token = userToken?.otpToken;
        let userTokenTable = await models_1.userOtpModel.findOne({
            where: {
                username: data.username,
            },
        });
        let token2 = userTokenTable?.token;
        // match token same token is assocate with same user
        if (token == data.token && token2 == data.token) {
            const expire = new Date(`${userTokenTable?.expire}`).getTime();
            const updateDate = Date.now();
            let expireDate = Math.floor(expire / 1000);
            let currentDate = Math.floor(updateDate / 1000);
            if (expireDate >= currentDate) {
                return true;
            }
            else {
                throw new Error("Sorry your otp is expired.");
            }
        }
        else {
            throw new Error("Sorry token is not assocated with your account.");
        }
        return token;
    }
    // match register / login
    async matchOtp(data) {
        let userTokenTable = await models_1.userOtpModel.findOne({
            where: {
                username: data.username,
            },
            raw: true
        });
        const expire = new Date(`${userTokenTable?.expire}`).getTime();
        const updateDate = Date.now();
        let expireDate = Math.floor(expire / 1000);
        let currentDate = Math.floor(updateDate / 1000);
        if (data.otp == userTokenTable?.otp) {
            if (expireDate >= currentDate) {
                return { "success": true, "message": 'Otp Matched!!' };
            }
            else {
                return { "success": false, "message": 'Sorry your otp is expired.' };
                throw new Error("Sorry your otp is expired.");
            }
        }
        else {
            return { "success": false, "message": 'You enter the wrong otp.' };
            throw new Error("You enter the wrong otp.");
        }
    }
}
exports.default = otpService;

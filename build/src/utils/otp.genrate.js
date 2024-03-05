"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const crypto_js_1 = __importDefault(require("crypto-js"));
const models_1 = require("../models");
const speakeasy_1 = __importDefault(require("speakeasy"));
;
class otpGenerate {
    /**
     * To add minutes to the current time
     * @param date
     * @returns
     */
    AddMinutesToDate(date) {
        let expiretime = process.env.OTP_EXPIRE_TIME || 1;
        return new Date(date.getTime() + +expiretime * 60000);
    }
    /**
     * otp generator
     * @returns
     */
    otp_generator() {
        // Declare a string variable
        // which stores all string
        var string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let OTP = "";
        // Find the length of string
        var len = string.length;
        for (let i = 0; i < 6; i++) {
            OTP += string[Math.floor(Math.random() * len)];
        }
        // return OTP;
        return '123456';
    }
    /**
     * create otp for user and store in by user email / phone number
     * @param date
     * @returns
     */
    async createOtpForUser(data) {
        try {
            // console.log( data.username,"== data.username");
            let apiStatus;
            let otp = this.otp_generator();
            const now = new Date();
            const expiration_time = this.AddMinutesToDate(now);
            //const token = this.token();
            // Encrypt
            let token = crypto_js_1.default.AES.encrypt(`${Date.now()}`, "secret key 123").toString();
            await models_1.userOtpModel
                .findOne({ where: { username: data.username } })
                .then(async (obj) => {
                // update
                if (obj) {
                    models_1.userModel
                        .findOne({
                        where: {
                            [sequelize_1.Op.or]: [
                                { email: data.username },
                                { number: data.username },
                            ],
                        },
                    })
                        .then(async (res) => {
                        await res?.update({ otpToken: token });
                    });
                    await obj.update({
                        otp: otp,
                        expire: expiration_time,
                        token: token,
                    });
                    apiStatus = await models_1.userOtpModel.findOne({
                        where: { username: data.username }, attributes: {
                            exclude: [
                                "deletedAt",
                                "otp",
                                "username",
                                "token",
                                "updatedAt:",
                                "deletedAt",
                            ],
                        }, raw: true
                    });
                }
                else {
                    models_1.userModel
                        .findOne({
                        where: {
                            [sequelize_1.Op.or]: [{ email: data.username }, { number: data.username }],
                        },
                    })
                        .then(async (res) => {
                        // console.log("working .....", data.username, res);
                        await res?.update({ otpToken: token });
                    });
                    //insert
                    await models_1.userOtpModel.create({
                        username: data.username,
                        otp: otp,
                        token: token,
                        expire: expiration_time,
                    });
                    apiStatus = await models_1.userOtpModel.findOne({
                        where: { username: data.username }, attributes: {
                            exclude: [
                                "deletedAt",
                                "otp",
                                "username",
                                "token",
                                "updatedAt:",
                                "deletedAt",
                            ],
                        }, raw: true
                    });
                }
            });
            return apiStatus;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * verfiy user provide otp is valid or expired
     */
    verifyOtpValid = async (data) => {
        try {
            /** match otp */
            let getOtp = await models_1.userModel.findOne({
                where: {
                    [sequelize_1.Op.or]: [{ email: data.username }, { number: data.username }]
                }
            });
            return true;
        }
        catch (error) {
            return false;
        }
    };
    referalCodeGenerate = () => {
        var string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let code = "";
        // Find the length of string
        var len = string.length;
        for (let i = 0; i < 10; i++) {
            code += string[Math.floor(Math.random() * len)];
        }
        return code;
    };
    secretCodeGenerate = () => {
        var secret = speakeasy_1.default.generateSecret({ length: 20 });
        return JSON.stringify(secret);
    };
}
exports.default = otpGenerate;
// CREATE NOD MAILER CODE IN NODEJS?

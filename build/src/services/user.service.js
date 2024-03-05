"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_dal_1 = __importDefault(require("../models/dal/users.dal"));
const users_model_1 = __importDefault(require("../models/model/users.model"));
const service_1 = __importDefault(require("./service"));
const speakeasy_1 = __importDefault(require("speakeasy"));
let userDataLayer = new users_dal_1.default();
class userServices {
    user;
    /**
     * user register
     * @param payload
     * @returns
     */
    create(payload) {
        return userDataLayer.create(payload);
    }
    /**
     * check user already exist in DB
     * @param id
     * @returns
     */
    async checkIfUserExsit(id) {
        return await userDataLayer.userAlreadyExist(id);
    }
    /**
     * User Login process
     * @param payload
     * @returns
     */
    async login(payload) {
        let user = await userDataLayer.login(payload);
        if (user == null) {
            return {
                success: false,
                message: "Opps! please check your credentials 1",
            };
        }
        let pass = service_1.default.bcypt.MDB_compareHash(`${payload.password}`, user.password);
        if (pass) {
            return { success: true, data: user };
        }
        else {
            return {
                success: false,
                message: "Opps! please check your credentials 1",
            };
        }
    }
    /**
     * Set google 2FA Authentication
     * @param payload
     * @returns
     */
    async googleAuth(payload) {
        try {
            // ======================================================
            // verify google 2FA code 
            // ======================================================
            const { secret, token, otp } = payload;
            if (secret && token) {
                const isVerified = speakeasy_1.default?.totp.verify({
                    secret: secret,
                    encoding: "base32",
                    token: token,
                });
                console.log("isVerified -->", isVerified);
                if (isVerified) {
                    let user = payload;
                    (user.TwoFA = payload?.TwoFA),
                        (user.password = payload?.password),
                        (user.id = payload?.user_id);
                    let result = await this.updateUser(user);
                }
                return isVerified;
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * Update user
     * @param payload
     * @returns
     */
    async updateUser(payload) {
        try {
            let user = await users_model_1.default.findOne({
                where: { id: payload.id },
                raw: true,
            });
            if (user) {
                let pass = service_1.default.bcypt.MDB_compareHash(`${payload.password}`, user.password);
                if (pass) {
                    await delete payload?.password;
                    await delete payload?.secret;
                    // console.log(payload);
                    let res = await users_model_1.default.update(payload, {
                        where: { id: payload.id },
                    });
                    // console.log(res[0]);
                    return true;
                }
                else {
                    return {
                        success: false,
                        message: "Opps! please check your password",
                    };
                }
            }
            else {
                throw new Error("User not found");
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * confirm user fund code matched or not
     * @param payload
     * @returns
     */
    async confirmFundcode(payload) {
        try {
            let user = await users_model_1.default.findOne({ where: { id: payload.user_id } });
            let data = user?.dataValues;
            if (data) {
                if (data.tradingPassword?.toString() !== payload.old_password) {
                    throw new Error("Trading password not matched. Please try agaim.");
                }
                return true;
            }
            else {
                throw new Error("User not found");
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * update user fund code
     * @param payload
     * @returns
     */
    async updateFundcode(payload) {
        try {
            let user = await users_model_1.default.findOne({ where: { id: payload.user_id } });
            if (user) {
                if (user.dataValues?.tradingPassword !== "" &&
                    user.dataValues?.tradingPassword !== null &&
                    user.dataValues?.tradingPassword !== undefined) {
                    let isMatched = await this.confirmFundcode(payload);
                    if (isMatched == true) {
                        return await user.update({ tradingPassword: payload.new_password });
                    }
                }
                else {
                    return await user.update({ tradingPassword: payload.new_password });
                }
            }
            else {
                throw new Error("User not found");
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * confirm user password matched or not
     * @param payload
     * @returns
     */
    async confirmPassword(payload) {
        try {
            let user = await users_model_1.default.findOne({ where: { id: payload.user_id } });
            let data = user?.dataValues;
            let pass = service_1.default.bcypt.MDB_compareHash(`${payload.old_password}`, data?.password);
            if (pass) {
                return true;
            }
            else {
                return false;
                throw new Error("Old Password not matched. Please try agaim.");
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * Check user trading password matched or not
     * @param payload
     * @returns
     */
    async confirmTradingPassword(payload) {
        try {
            let user = await users_model_1.default.findOne({ where: { id: payload.user_id }, raw: true });
            let data = user;
            let pass = service_1.default.bcypt.MDB_compareHash(`${payload.old_password}`, data?.tradingPassword);
            if (pass) {
                return true;
            }
            else {
                return false;
                throw new Error("Old Password not matched. Please try agaim.");
            }
            // if (data?.tradingPassword === payload.old_password) {
            //   return true;
            // } else {
            //   return false;
            //   throw new Error("Old Password not matched. Please try agaim.");
            // }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * Update user account password
     * @param payload
     * @returns
     */
    async updatePassword(payload) {
        try {
            let user = await users_model_1.default.findOne({ where: { id: payload.user_id } });
            if (user) {
                let password = await service_1.default.bcypt.MDB_crateHash(payload?.new_password);
                return await user.update({ password: password });
            }
            else {
                throw new Error("User not found");
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * set user trading password
     * @param payload
     * @returns
     */
    async tradingPassword(payload) {
        try {
            let user = await users_model_1.default.findOne({ where: { id: payload.user_id } });
            if (user) {
                return await user.update({ tradingPassword: payload.new_password });
            }
            else {
                throw new Error("User not found");
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * Get users Lsit
     * @returns
     */
    async getUsersList() {
        return userDataLayer.getListOfUser();
    }
    /**
     * Admin user list by offset and limit per page
     * @param offset
     * @param limit
     * @returns
     */
    async getUsersListByLimit(offset, limit) {
        return userDataLayer.getListOfUserByLimit(offset, limit);
    }
    /**
     * Get Admin profit list
     * @returns
     */
    async getAdminProfitList() {
        return userDataLayer.getListOfAdminProfit();
    }
    /**
     * Get user activity list
     * @returns
     */
    async getUsersActivityList() {
        return userDataLayer.getListOfUserActivity();
    }
    /**
     * Get users activity list by offset and limit per page
     * @param offset
     * @param limit
     * @returns
     */
    async getUsersActivityListByLimit(offset, limit) {
        return userDataLayer.getListOfUserActivityByLimit(offset, limit);
    }
    /**
     * Get single user activity list by offset and limit per page
     * @param userid
     * @param offset
     * @param limit
     * @returns
     */
    async getUsersActivityListByIdLimit(userid, offset, limit) {
        return userDataLayer.getListOfUserActivityByIdLimit(userid, offset, limit);
    }
    /**
     * Update user status block unblock
     * @param payload
     * @returns
     */
    async updateUserStatus(payload) {
        try {
            let user = await users_model_1.default.findOne({ where: { id: payload.id } });
            if (user) {
                return await user.update({ statusType: payload.statusType });
            }
            else {
                throw new Error("User not found");
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     *  update user pin for security
     * @param payload
     * @returns
     */
    async updateUserPin(payload) {
        try {
            let user = await users_model_1.default.findOne({ where: { id: payload.id } });
            if (user) {
                return await user.update({ pin_code: payload.pin_code });
            }
            else {
                throw new Error("User not found");
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * User activity
     * @param user_id
     * @returns
     */
    async userActivity(user_id) {
        return await userDataLayer.getUserDetailAllActivity(user_id);
    }
    /**
     * clear users activity by user
     * @param user_id
     * @returns
     */
    async clearActivityList(user_id) {
        return await userDataLayer.clearAllUserActivity(user_id);
    }
    /**
     * Get user counts data
     */
    async getUserDataAsCounts() {
        let totalUsers = await users_model_1.default.findAll({ raw: true });
        let activeUsers = totalUsers.filter((item) => {
            return item.statusType === true || item.statusType === 1;
        });
        return { total: totalUsers.length, activeUser: activeUsers.length };
    }
}
exports.default = userServices;

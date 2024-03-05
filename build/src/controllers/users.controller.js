"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const users_model_1 = __importDefault(require("../models/model/users.model"));
const service_1 = __importDefault(require("../services/service"));
const covalenthq_1 = __importDefault(require("../blockchain/scaner/covalenthq"));
const models_1 = require("../models");
class userController extends main_controller_1.default {
    async executeImpl(req, res) {
        try {
            // ... Handle request by creating objects
        }
        catch (error) {
            return super.fail(res, error.toString());
        }
    }
    /**
     *
     * @param req
     * @param res
     */
    async register(req, res, next) {
        try {
            const user = req.body;
            let regx = /^[6-9]\d{9}$/;
            let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
            let flag = "";
            // verify provide username is
            if (regx.test(user?.username))
                flag = "number";
            if (regex.test(user?.username))
                flag = "email";
            // validate email & phone number
            if (flag == "") {
                return super.forbidden(res, `Please enter valid phone number or email.`);
            }
            //  recogonize user provided phone / email
            if (flag == "number")
                user.number = user?.username;
            if (flag == "email")
                user.email = user?.username;
            //   check if user already exist
            let userExist = await service_1.default.user.checkIfUserExsit(user?.username);
            let message;
            if (userExist) {
                let message = flag == "number" ? "Phone number" : "Email";
                return super.fail(res, `${message} is already used in our system.`);
                // throw new Error();
            }
            if (userExist === null && req.body?.step == 1) {
                return super.ok(res, "send otp");
            }
            if (req.body.otp === "string" ||
                req.body.otp === "" ||
                req.body.otp === null) {
                //SEND VERIFICATION MAIL TO USER
                if (flag == "email") {
                    //  send email otp to user
                    let otp = await service_1.default.otpGenerate.createOtpForUser(user);
                    // const emailTemplate = service.emailTemplate.otpVerfication(`${otp}`);
                    // let emailResponse = await service.emailService.sendMail(
                    //   req.headers["X-Request-Id"],
                    //   {
                    //     to: user.username,
                    //     subject: "Verify OTP",
                    //     html: emailTemplate.html,
                    //   }
                    // );
                    // if (
                    //   emailResponse?.accepted != undefined &&
                    //   emailResponse?.accepted?.length > 0
                    // ) {
                    //   return super.ok<any>(res, "Mail sent successfully!!");
                    // }
                    return super.ok(res, { message: "Mail sent successfully!!", otp });
                }
            }
            else {
                let userOtp;
                userOtp = {
                    username: user.username,
                    otp: req.body?.otp,
                };
                let result = await service_1.default.otpService.matchOtp(userOtp);
                if (result.success) {
                    //   normal password connect into hash
                    user.password = await service_1.default.bcypt.MDB_crateHash(user.password);
                    user.refeer_code = req.body.refeer_code;
                    user.own_code = await service_1.default.otpGenerate.referalCodeGenerate();
                    user.secret = await service_1.default.otpGenerate.secretCodeGenerate();
                    // console.log(user, "new register user");
                    let newuser = await service_1.default.user.create(user);
                    service_1.default.walletService.allWallets(newuser?.id);
                    //SENDING RESPONSE
                    return super.ok(res, newuser);
                }
                else {
                    return super.fail(res, result.message);
                }
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *login(req
     * @param req
     * @param res
     */
    async login(req, res, next) {
        try {
            let TOKEN_KEY = process.env.TOKEN_KEY ||
                "$2b$10$oy2o.eHnBE1bZMyAkj4GQ.j0nT4ceDBNU7PZ71Tjp19Mpwf0.NGlW";
            let user = req.body;
            let login = await service_1.default.user.login(user);
            if (login.success == false) {
                return super.fail(res, `Username & password is incorrect.`);
            }
            login = login.data;
            if (login && req.body?.step === 1) {
                return super.ok(res, "User Matched!!");
            }
            let userOtp;
            if (req.body?.otp === "string" ||
                req.body?.otp === "" ||
                req.body?.otp === null) {
                userOtp = { username: login?.email ? login?.email : login?.number };
                let otp = await service_1.default.otpGenerate.createOtpForUser(userOtp);
                // const emailTemplate = service.emailTemplate.otpVerfication(`${otp}`);
                // service.emailService.sendMail(req.headers["X-Request-Id"], {
                //   to: userOtp.username,
                //   subject: "Verify OTP",
                //   html: emailTemplate.html,
                // });
                // Return a 200
                super.ok(res, { message: "OTP sent in your inbox. Your account is almost logged-in please verify your otp", otp });
            }
            else {
                //  send email otp to user
                if (req.body?.otp) {
                    userOtp = {
                        username: login?.email ? login?.email : login?.number,
                        otp: req.body?.otp,
                    };
                    let result = await service_1.default.otpService.matchOtp(userOtp);
                    if (result.success === true) {
                        models_1.lastLoginModel
                            .findOne({
                            where: { user_id: login?.id },
                            order: [["loginTime", "DESC"]],
                            raw: true,
                        })
                            .then((userDetail) => {
                            if (userDetail) {
                                let obj = {
                                    user_id: login?.id,
                                    loginTime: Date.now(),
                                    lastLogin: userDetail?.loginTime,
                                    location: req?.body?.location,
                                    region: req?.body?.region,
                                    ip: req?.body?.ip,
                                    browser: req?.body?.browser,
                                    os: req?.body?.browser,
                                    deviceType: req.body?.deviceType,
                                };
                                models_1.lastLoginModel
                                    .create(obj)
                                    .then((updateRecord) => {
                                    if (updateRecord) {
                                        return updateRecord;
                                    }
                                })
                                    .catch((error) => {
                                    console.log("=====error1", error);
                                });
                            }
                            else {
                                let obj = {
                                    user_id: login?.id,
                                    loginTime: Date.now(),
                                    lastLogin: Date.now(),
                                    location: req?.body?.location,
                                    region: req?.body?.region,
                                    ip: req?.body?.ip,
                                    os: req?.body?.os,
                                    browser: req?.body?.browser,
                                    deviceType: req.body?.deviceType,
                                };
                                let data = models_1.lastLoginModel
                                    .create(obj)
                                    .then((updateRecord) => {
                                    if (updateRecord) {
                                        return updateRecord;
                                    }
                                })
                                    .catch((error) => {
                                    console.log("=====error2", error);
                                });
                            }
                        })
                            .catch((error) => {
                            console.error("====", error);
                        });
                        delete login["password"];
                        delete login["otpToken"];
                        // Create token
                        let token = service_1.default.jwt.sign({
                            user_id: login.id,
                            username: login?.email ? login?.email : login.number,
                            role: login?.role,
                        });
                        login.access_token = token;
                        return super.ok(res, {
                            status: "success",
                            message: "Your account has successfully logged-in.",
                            token: token,
                            user: login,
                        });
                    }
                    else {
                        return super.fail(res, result.message);
                    }
                }
            }
        }
        catch (error) {
            res.status(500).send({ message: error.message });
        }
    }
    /**
     *checkUser(
     * @param req
     * @param res
     */
    async checkUser(req, res) {
        try {
            let user = await users_model_1.default.findOne({
                where: { id: req.body.user_id },
                raw: true,
            });
            return super.ok(res, user);
        }
        catch (error) {
            return super.fail(res, error.message);
        }
    }
    /**
     *userAuthen
     * @param req
     * @param res
     */
    userAuthenticate(req, res) { }
    /**
     *updateUser
     * @param req
     * @param res
     */
    async updateUser(req, res) {
        try {
            // let user = await service.user.checkIfUserExsit(req?.body?.username);
            let alreadyExist = await service_1.default.user.checkIfUserExsit(req?.body?.data);
            let regx = /^[6-9]\d{9}$/;
            let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
            let flag = "";
            // verify provide username is
            if (regx.test(req.body?.data))
                flag = "number";
            if (regex.test(req.body?.data))
                flag = "email";
            if (alreadyExist) {
                // console.log(res)
                return super.fail(res, `This ${flag} is already exist. Try another ${flag}`);
            }
            else {
                let userOtp;
                let userNewOtp;
                if (req.body?.otp === "string" ||
                    req.body?.otp === "" ||
                    req.body?.otp === null) {
                    userOtp = { username: req?.body?.username };
                    userNewOtp = { username: req?.body?.data };
                    let otp = await service_1.default.otpGenerate.createOtpForUser(userOtp);
                    let otp2 = await service_1.default.otpGenerate.createOtpForUser(userNewOtp);
                    const emailTemplate = service_1.default.emailTemplate.otpVerfication(`${otp}`);
                    const newEmailTemplate = service_1.default.emailTemplate.otpVerfication(`${otp2}`);
                    // console.log(userOtp.username, " ========== 00")
                    let emailResponse = await service_1.default.emailService.sendMail(req.headers["X-Request-Id"], {
                        to: userOtp.username,
                        subject: "Verify OTP",
                        html: emailTemplate.html,
                    });
                    let emailResponse2 = await service_1.default.emailService.sendMail(req.headers["X-Request-Id"], {
                        to: userNewOtp.username,
                        subject: "Verify OTP",
                        html: newEmailTemplate.html,
                    });
                    if (emailResponse?.accepted != undefined &&
                        emailResponse?.accepted?.length > 0) {
                        return super.ok(res, {
                            data: "OTP sent in your inbox. please your verify otp",
                        });
                    }
                    // Return a 200
                }
                else {
                    if (req.body?.otp) {
                        let username = req?.body?.password == "" ? req?.body?.data : req?.body?.username;
                        userOtp = {
                            username: username,
                            otp: req.body?.otp,
                        };
                        let result = await service_1.default.otpService.matchOtp(userOtp);
                        if (result.success) {
                            if (req?.body?.password == "") {
                                super.ok(res, "match successfully");
                            }
                            else {
                                let user = req.body;
                                user.id = req.body.user_id;
                                if (flag === "email") {
                                    user.email = req.body.data;
                                }
                                else {
                                    user.number = req.body.data;
                                }
                                let userResponse = await service_1.default.user.updateUser(user);
                                // console.log(userResponse);
                                // if(userResponse)
                                super.ok(res, {
                                    data: "User update successfully.",
                                });
                            }
                        }
                        else {
                            return super.fail(res, result.message);
                        }
                    }
                }
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *verifyGoog
     * @param req
     * @param res
     */
    async verifyGoogleAuth(req, res) {
        try {
            let user = await service_1.default.user.checkIfUserExsit(req?.body?.username);
            if (user) {
                let userOtp;
                if (req.body?.otp === "string" ||
                    req.body?.otp === "" ||
                    req.body?.otp === null) {
                    //  send email otp to user
                    userOtp = { username: req?.body?.username };
                    let otp = await service_1.default.otpGenerate.createOtpForUser(userOtp);
                    // const emailTemplate = service.emailTemplate.otpVerfication(`${otp}`);
                    // service.emailService.sendMail(req.headers["X-Request-Id"], {
                    //   to: userOtp.username,
                    //   subject: "Verify OTP",
                    //   html: emailTemplate.html,
                    // });
                    super.ok(res, { message: "OTP sent in your inbox. please your verify otp", otp });
                }
                else {
                    if (req.body?.otp) {
                        userOtp = {
                            username: req?.body?.username,
                            otp: req.body?.otp,
                        };
                        let result = await service_1.default.otpService.matchOtp(userOtp);
                        if (result.success === true) {
                            let user = await users_model_1.default.findOne({
                                where: { id: req?.body?.user_id },
                                raw: true,
                            });
                            let pass = service_1.default.bcypt.MDB_compareHash(`${req?.body?.password}`, user?.password);
                            if (pass) {
                                let pwdData = req.body;
                                pwdData.TwoFA = user?.TwoFA === true || user?.TwoFA === 1 ? false : true;
                                let pwdResponse = await service_1.default.user.googleAuth(pwdData);
                                if (pwdResponse === true) {
                                    user = await users_model_1.default.findOne({
                                        where: { id: req?.body?.user_id },
                                        raw: true,
                                    });
                                    super.ok(res, {
                                        message: `Two Factor Authentication ${user.TwoFA === true || user.TwoFA ? 'Enabled' : 'Disabled'}!!.`,
                                        result: user.TwoFA === true || user.TwoFA === 1 ? true : false,
                                    });
                                }
                                else {
                                    return super.fail(res, 'Google security code not matched');
                                }
                            }
                            else {
                                return super.fail(res, 'Password not matched');
                            }
                        }
                        else {
                            return super.fail(res, result.message);
                        }
                    }
                }
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *updatePass
     * @param req
     * @param res
     */
    async updatePassword(req, res) {
        try {
            if (req.body.type === "forget") {
                let user = await service_1.default.user.checkIfUserExsit(req?.body?.username);
                if (user) {
                    if (req.body.step === 1) {
                        return super.ok(res, "User matched");
                    }
                    let userOtp;
                    if (req.body?.otp === "string" ||
                        req.body?.otp === "" ||
                        req.body?.otp === null) {
                        //  send email otp to user
                        userOtp = { username: req?.body?.username };
                        let otp = await service_1.default.otpGenerate.createOtpForUser(userOtp);
                        // const emailTemplate = service.emailTemplate.otpVerfication(`${otp}`);
                        // service.emailService.sendMail(req.headers["X-Request-Id"], {
                        //   to: userOtp.username,
                        //   subject: "Verify OTP",
                        //   html: emailTemplate.html,
                        // });
                        super.ok(res, { message: "OTP sent in your inbox. please your verify otp", otp });
                    }
                    else {
                        if (req.body?.otp) {
                            userOtp = {
                                username: req?.body?.username,
                                otp: req.body?.otp,
                            };
                            let result = await service_1.default.otpService.matchOtp(userOtp);
                            if (result.success === true) {
                                let pwdData = req.body;
                                pwdData.user_id = user?.dataValues?.id;
                                let pwdResponse = await service_1.default.user.updatePassword(pwdData);
                                super.ok(res, {
                                    status: 200,
                                    message: "Password update successfully!!.",
                                    result: pwdResponse,
                                });
                            }
                            else {
                                return super.fail(res, result.message);
                            }
                        }
                    }
                }
                else {
                    return super.fail(res, "Old Password not matched. Please try again.");
                }
            }
            else {
                let isMatched = await service_1.default.user.confirmPassword(req?.body);
                if (isMatched) {
                    if (req.body.step === 1) {
                        return super.ok(res, "User matched");
                    }
                    let userOtp;
                    if (req.body?.otp === "string" ||
                        req.body?.otp === "" ||
                        req.body?.otp === null) {
                        //  send email otp to user
                        userOtp = { username: req?.body?.username };
                        let otp = await service_1.default.otpGenerate.createOtpForUser(userOtp);
                        // const emailTemplate = service.emailTemplate.otpVerfication(`${otp}`);
                        // service.emailService.sendMail(req.headers["X-Request-Id"], {
                        //   to: userOtp.username,
                        //   subject: "Verify OTP",
                        //   html: emailTemplate.html,
                        // });
                        super.ok(res, { message: "OTP sent in your inbox. please your verify otp", otp });
                    }
                    else {
                        if (req.body?.otp) {
                            userOtp = {
                                username: req?.body?.username,
                                otp: req.body?.otp,
                            };
                            let result = await service_1.default.otpService.matchOtp(userOtp);
                            if (result.success === true) {
                                let pwdData = req.body;
                                let pwdResponse = await service_1.default.user.updatePassword(pwdData);
                                super.ok(res, {
                                    status: 200,
                                    message: "Password update successfully!!.",
                                    result: pwdResponse,
                                });
                            }
                            else {
                                return super.fail(res, result.message);
                            }
                        }
                    }
                }
                else {
                    return super.fail(res, "Old Password not matched. Please try again.");
                }
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *tradePass
     * @param req
     * @param res
     */
    async tradingPassword(req, res) {
        try {
            if (req.body.step === 1) {
                let user = await service_1.default.user.checkIfUserExsit(req.body.username);
                if (user) {
                    return super.ok(res, "User matched");
                }
            }
            let isMatched;
            if (req?.body?.old_password) {
                isMatched = await service_1.default.user.confirmTradingPassword(req?.body);
                if (isMatched) {
                    let userOtp;
                    if (req.body?.otp === "string" ||
                        req.body?.otp === "" ||
                        req.body?.otp === null) {
                        userOtp = { username: req?.body?.username };
                        let otp = await service_1.default.otpGenerate.createOtpForUser(userOtp);
                        // const emailTemplate = service.emailTemplate.otpVerfication(`${otp}`);
                        // service.emailService.sendMail(req.headers["X-Request-Id"], {
                        //   to: userOtp.username,
                        //   subject: "Verify OTP",
                        //   html: emailTemplate.html,
                        // });
                        super.ok(res, { message: "OTP sent in your inbox. please your verify otp", otp });
                    }
                    else {
                        //  send email otp to user
                        if (req.body?.otp) {
                            userOtp = {
                                username: req?.body?.username,
                                otp: req.body?.otp,
                            };
                            let result = await service_1.default.otpService.matchOtp(userOtp);
                            if (result.success === true) {
                                let pwdData = req.body;
                                pwdData.new_password = await service_1.default.bcypt.MDB_crateHash(pwdData.new_password);
                                let pwdResponse = await service_1.default.user.tradingPassword(pwdData);
                                super.ok(res, {
                                    status: 200,
                                    message: "Trading password update successfully!!.",
                                    result: pwdResponse,
                                });
                            }
                            else {
                                super.fail(res, result.message);
                            }
                        }
                    }
                }
                else {
                    return super.fail(res, "Old Password not matched. Please try again.");
                }
            }
            else {
                let userOtp;
                if (req.body?.otp === "string" ||
                    req.body?.otp === "" ||
                    req.body?.otp === null) {
                    userOtp = { username: req?.body?.username };
                    let otp = await service_1.default.otpGenerate.createOtpForUser(userOtp);
                    // const emailTemplate = service.emailTemplate.otpVerfication(`${otp}`);
                    // service.emailService.sendMail(req.headers["X-Request-Id"], {
                    //   to: userOtp.username,
                    //   subject: "Verify OTP",
                    //   html: emailTemplate.html,
                    // });
                    // Return a 200
                    super.ok(res, { message: "OTP sent in your inbox. please verify your otp", otp });
                }
                else {
                    //  send email otp to user
                    if (req.body?.otp) {
                        userOtp = {
                            username: req?.body?.username,
                            otp: req.body?.otp,
                        };
                        let result = await service_1.default.otpService.matchOtp(userOtp);
                        if (result?.success === true) {
                            let pwdData = req.body;
                            pwdData.new_password = await service_1.default.bcypt.MDB_crateHash(pwdData.new_password);
                            let pwdResponse = await service_1.default.user.tradingPassword(pwdData);
                            super.ok(res, {
                                status: 200,
                                message: " Trading password create successfully!!.",
                                result: pwdResponse,
                            });
                        }
                        else {
                            super.fail(res, result?.message);
                        }
                    }
                }
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *confirmPas
     * @param req
     * @param res
     */
    async confirmPassword(req, res) {
        try {
            let data = req.body;
            let passwordResponse = await service_1.default.user.confirmPassword(data);
            if (passwordResponse) {
                super.ok(res, {
                    message: "Password matched successfully!.",
                    result: passwordResponse,
                });
            }
            else {
                super.fail(res, "Old Password not matched successfully!.");
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *confirmFun
     * @param req
     * @param res
     */
    async confirmFuncode(req, res) {
        try {
            let data = req.body;
            let fundingCodeResponse = await service_1.default.user.confirmFundcode(data);
            super.ok(res, {
                message: "Funding password matched successfully!.",
                result: fundingCodeResponse,
            });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *updatePass
     * @param req
     * @param res
     */
    async updateFundcode(req, res) {
        try {
            let pwdData = req.body;
            let pwdResponse = await service_1.default.user.updateFundcode(pwdData);
            super.ok(res, {
                message: "Paaword update successfully!!.",
                result: pwdResponse,
            });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *removeUser
     * @param req
     * @param res
     */
    removeUser(req, res) { }
    /**
     *depositAdd
     * @param req
     * @param res
     */
    depositAddress(req, res) { }
    /**
     *userExist
     * @param req
     * @param res
     */
    async userExist(req, res) {
        try {
            let formInput = req.body;
            console.log(formInput, "==========here========");
            let regx = /^[6-9]\d{9}$/;
            let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
            let flag = "";
            const user = req.body;
            // verify provide username is
            if (regx.test(user?.username))
                flag = "number";
            if (regex.test(user?.username))
                flag = "email";
            let userExist = await service_1.default.user.checkIfUserExsit(user?.username);
            if (userExist) {
                let message = flag == "number" ? "Phone number" : "Email";
                return this.forbidden(res, `${message} is already used in our system.`);
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *authRemove
     * @param req
     * @param res
     */
    authRemove(req, res) { }
    async userAccountScanner(req, res) {
        try {
            let { address, chainid, userid } = req.params;
            //============================================//
            // check address & chainid is provided or not
            //============================================//
            if (!address && !chainid)
                throw new Error("Please provide wallet address and chainid");
            let cova = new covalenthq_1.default();
            let trns = await cova.scanner(address, +chainid, userid);
            if (trns === undefined) {
                return super.ok(res, []);
            }
            super.ok(res, trns);
            // res.status(200).send(trns);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     * userList
     * @param req
     * @param res
     */
    async usersList(req, res) {
        try {
            let userResponse = await service_1.default.user.getUsersList();
            super.ok(res, userResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     * userListByLimit
     * @param req
     * @param res
     */
    async usersListByLimit(req, res) {
        try {
            let { offset, limit } = req.params;
            let users = await service_1.default.user.getUsersList();
            let userResponse = await service_1.default.user.getUsersListByLimit(offset, limit);
            super.ok(res, { data: userResponse, total: users?.length });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     * adminProfit
     * @param req
     * @param res
     */
    async getAdminProfit(req, res) {
        try {
            let adminProfit = await service_1.default.user.getAdminProfitList();
            let tokens = await service_1.default.token.adminTokenAll();
            // console.log(adminProfit, "==admin");
            adminProfit.map((item, index) => {
                tokens.filter((x) => {
                    if (x.symbol == item.coin_type) {
                        item.fees *= x.price;
                    }
                });
            });
            // console.log(adminProfit, "==admin");
            super.ok(res, adminProfit);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     * activityList
     * @param req
     * @param res
     */
    async activityList(req, res) {
        try {
            let activityResponse = await service_1.default.user.getUsersActivityList();
            super.ok(res, activityResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     * activityListByLimit
     * @param req
     * @param res
     */
    async activityListByLimit(req, res) {
        try {
            let { offset, limit } = req?.params;
            let activityResponse = await service_1.default.user.getUsersActivityList();
            let activityResponsePaginate = await service_1.default.user.getUsersActivityListByLimit(offset, limit);
            super.ok(res, { data: activityResponsePaginate, total: activityResponse?.length });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     * activityListByLimit
     * @param req
     * @param res
     */
    async activityListByIdLimit(req, res) {
        try {
            let { offset, limit, userid } = req?.params;
            let activityResponse = await service_1.default.user.getUsersActivityList();
            let activityResponsePaginate = await service_1.default.user.getUsersActivityListByIdLimit(userid, offset, limit);
            super.ok(res, { data: activityResponsePaginate, total: activityResponse?.length });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     * clearActivity
     * @param req
     * @param res
     */
    async clearActivity(req, res) {
        try {
            let activityResponse = await service_1.default.user.clearActivityList(req.params.userid);
            if (activityResponse) {
                console.log(activityResponse);
                super.ok(res, {
                    message: "Activity cleared!!.",
                });
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *update user status
     * @param req
     * @param res
     */
    async userUpdate(req, res) {
        try {
            let data = req.body;
            let pwdResponse = await service_1.default.user.updateUserStatus(data);
            if (pwdResponse) {
                let result = await users_model_1.default.findAll();
                let user = await users_model_1.default.findOne({
                    where: { id: req.body.user_id },
                    raw: true,
                });
                const emailTemplate = service_1.default.emailTemplate.announcementMail();
                // console.log(userOtp.username, " ========== 00")
                service_1.default.emailService.sendMail(req.headers["X-Request-Id"], {
                    to: user?.email || "",
                    subject: "Verify OTP",
                    html: emailTemplate.html,
                });
                super.ok(res, {
                    message: "Status update successfully!!.",
                    result: result,
                });
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async userPinUpdate(req, res) {
        try {
            let data = req.body;
            let pwdResponse = await service_1.default.user.updateUserPin(data);
            if (pwdResponse) {
                let result = await users_model_1.default.findAll();
                super.ok(res, {
                    message: "Status update successfully!!.",
                    result: result,
                });
            }
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async userInformationByUserId(req, res) {
        try {
            let userResponse = await service_1.default.user.userActivity(req.params.id);
            super.ok(res, userResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    async getUserDataAsCounts(req, res) {
        try {
            let userData = await service_1.default.user.getUserDataAsCounts();
            super.ok(res, userData);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
}
exports.default = userController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("./main.controller"));
const service_1 = __importDefault(require("../services/service"));
const joi_1 = __importDefault(require("joi"));
const models_1 = require("../models");
const lodash_1 = require("lodash");
class paymentController extends main_controller_1.default {
    async executeImpl(req, res) {
        try {
            // ... Handle request by creating objects
        }
        catch (error) {
            return this.fail(res, error.toString());
        }
    }
    /**
    * Add new payment method from admin dashboard
    * @param res
    * @param req
    */
    async create(req, res, next) {
        try {
            const obj = JSON.parse(JSON.stringify(req.files));
            for (let itm in obj) {
                req.body[itm] = obj[itm][0]?.filename;
            }
            let method = req.body;
            let paymentResponse = await service_1.default.p_method.create(method);
            // console.log(paymentResponse,'===========paymentResponse');
            if (paymentResponse.hasOwnProperty('status') && paymentResponse.status !== 200) {
                return super.fail(res, paymentResponse.message === "" ? paymentResponse.additionalInfo : paymentResponse.message);
            }
            super.ok(res, { message: 'Payment method added successfully!.', result: paymentResponse });
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
    async list(req, res, next) {
        try {
            let paymentResponse = await service_1.default.p_method.getMethodList();
            super.ok(res, paymentResponse);
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
    async single(req, res, next) {
        try {
            let paymentResponse = await service_1.default.p_method.getPaymentMethodById(req.params.id);
            super.ok(res, paymentResponse);
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
    async addMethod(req, res) {
        try {
            if (req.body?.otp === "string" ||
                req.body?.otp === "" ||
                req.body?.otp === null) {
                let passCodeVerify = await models_1.userModel.findOne({
                    where: { id: req.body.user_id },
                    attributes: {
                        exclude: ['id', 'dial_code', 'password', 'otpToken', 'cronStatus', 'deletedAt', 'TwoFA', 'kycstatus', 'statusType', 'registerType', 'role', 'secret', 'own_code', 'refeer_code', 'antiphishing', 'createdAt', 'updatedAt', 'UID']
                    },
                    raw: true
                });
                let userOtp = { username: passCodeVerify?.email ? passCodeVerify?.email : passCodeVerify?.number };
                let otp = await service_1.default.otpGenerate.createOtpForUser(userOtp);
                // const emailTemplate = service.emailTemplate.otpVerfication(`${otp}`);
                // service.emailService.sendMail(req.headers["X-Request-Id"], {
                //   to: userOtp.username,
                //   subject: "Verify OTP",
                //   html: emailTemplate.html,
                // });
                return super.ok(res, "OTP sent");
            }
            let uMethod = req.body;
            if ((0, lodash_1.isEmpty)(uMethod.pmObject)) {
                return super.fail(res, "Please select payment method..");
            }
            let p_method = await models_1.paymentMethodModel.findOne({ where: { id: uMethod.pmid }, raw: true });
            let pmobj = { passcode: joi_1.default.string().required() };
            let fieldsArray = p_method.fields;
            for (const field of fieldsArray) {
                if (field.type === 'text' || field.type === "name") {
                    pmobj[field.name] = joi_1.default.string().required();
                }
                if (field.type === 'number') {
                    pmobj[field.name] = joi_1.default.number().integer().required();
                }
                if (field.type === 'file') {
                    // pmobj[field.name] = Joi.binary().encoding('utf8').optional();
                }
            }
            let user_pmethod_schema = joi_1.default.object().keys({
                user_id: joi_1.default.string().required(),
                pmid: joi_1.default.string().required(),
                status: joi_1.default.string().required(),
                pm_name: joi_1.default.string().required(),
                pmObject: joi_1.default.object(pmobj).optional(),
                otp: joi_1.default.number().required()
            });
            const result2 = user_pmethod_schema.validate(uMethod);
            if (result2.error !== undefined) {
                return super.fail(res, result2.error?.message);
            }
            let userpMethodResponse = await service_1.default.p_method.createUserPaymentMethod(uMethod);
            super.ok(res, { message: "User payment method added successfully!!!.", result: userpMethodResponse });
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *
     * @param res
     * @param req
     */
    async getMethod(req, res) {
        try {
            let methodResponse = await service_1.default.p_method.getUserMethod(req.body.user_id);
            super.ok(res, methodResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
    /**
     *
     * @param res
     * @param req
     */
    async deleteRequest(req, res) {
        try {
            let deleteResponse = await service_1.default.p_method.removeUserMethodById(req.params.id);
            super.ok(res, deleteResponse);
        }
        catch (error) {
            super.fail(res, error.message);
        }
    }
}
exports.default = paymentController;

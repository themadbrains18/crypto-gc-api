"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const kycSchema = {
    // trigger when list new a exchange
    create: joi_1.default.object().keys({
        userid: joi_1.default.string().min(3).max(500).required(),
        country: joi_1.default.string().required(),
        fname: joi_1.default.string().required(),
        // lname: Joi.string().required(),
        doctype: joi_1.default.string().required(),
        docnumber: joi_1.default.string().required(),
        idfront: joi_1.default.binary().encoding('utf8').optional(),
        idback: joi_1.default.binary().encoding('utf8').optional(),
        statement: joi_1.default.binary().encoding('utf8').optional(),
        destinationPath: joi_1.default.string().optional(),
        dob: joi_1.default.date().required(),
    }),
    status: joi_1.default.object().keys({
        userid: joi_1.default.string().min(3).max(500).required(),
        isVerified: joi_1.default.boolean().optional(),
        isReject: joi_1.default.boolean().optional(),
        user_id: joi_1.default.string().optional()
    }),
};
exports.default = kycSchema;

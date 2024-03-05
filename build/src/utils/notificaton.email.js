"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const main_service_1 = __importDefault(require("../services/main.service"));
class MailService extends main_service_1.default {
    enable = process.env.EMAILSERVICE;
    constructor() {
        super();
        this.verifyMailConnection();
    }
    //CREATE A CONNECTION FOR LIVE
    async createConnection() {
        let host = process.env.SMTP_HOST;
        let username = process.env.SMTP_USERNAME;
        let password = process.env.SMTP_PASSWORD;
        return nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            // secure: process.env.SMTP_TLS === 'yes' ? true : false,
            auth: {
                user: "sakshisethi.mdb@gmail.com",
                pass: "wjstmftxjgibyyag",
            },
            logger: false
        });
    }
    //SEND MAIL
    async sendMail(requestId, options) {
        // check if email service is enabled or not
        if (this.enable != "enable") {
            return;
        }
        let transporter = await this.createConnection();
        return await transporter
            .sendMail({
            from: `"The Mad Brains" ${process.env.SMTP_SENDER || options.from}`,
            to: options.to,
            cc: options.cc,
            bcc: options.bcc,
            subject: options.subject,
            text: options.text,
            html: options.html,
        })
            .then((info) => {
            if (process.env.NODE_ENV === 'local') {
            }
            return info;
        });
    }
    async verifyMailConnection() {
        return false;
        let transporter = this.createConnection();
        // verify connection configuration
        (await transporter).verify(function (error, success) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Server is ready to take our messages");
            }
        });
    }
}
exports.default = MailService;

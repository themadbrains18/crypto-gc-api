import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config();

import serviceBaseController from "../services/main.service";
import { BlobOptions } from 'buffer';




interface MailInterface {
    from?: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html: string;
}

class MailService extends serviceBaseController {

    enable = process.env.EMAILSERVICE

    constructor() {
        super()
        this.verifyMailConnection()
    }

    //CREATE A CONNECTION FOR LIVE
    async createConnection() {

        let host = process.env.SMTP_HOST;
        let username = process.env.SMTP_USERNAME;
        let password = process.env.SMTP_PASSWORD;

        return nodemailer.createTransport({
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
    async sendMail(requestId: string | number | string[] | undefined, options: MailInterface) {

        // check if email service is enabled or not
        if (this.enable != "enable") {
            return
        }


        let transporter = await this.createConnection()

        return await transporter
            .sendMail({
                from: `The Mad Brains <${process.env.SMTP_USERNAME || options.from}>`,
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

    async verifyMailConnection(): Promise<void | boolean> {
        return false;

        let transporter = this.createConnection();


        // verify connection configuration
        (await transporter).verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });
    }


}

export default MailService
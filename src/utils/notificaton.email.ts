import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import serviceBaseController from "../services/main.service"; // Base controller class
import { BlobOptions } from 'buffer'; // Unused import; consider removing if unnecessary

// Define an interface for the email options
interface MailInterface {
    from?: string;             // Optional sender email address
    to: string | string[];      // Recipient(s) email address(es)
    cc?: string | string[];     // Optional CC recipient(s)
    bcc?: string | string[];    // Optional BCC recipient(s)
    subject: string;            // Email subject
    text?: string;              // Optional plain text version of the email content
    html: string;               // HTML version of the email content
}

// MailService class handles email sending
class MailService extends serviceBaseController {
    enable = process.env.EMAILSERVICE; // Environment variable to enable/disable email service

    constructor() {
        super();
        this.verifyMailConnection(); // Verifies connection upon initialization
    }

    // Method to create a connection to the SMTP server
    async createConnection() {
        let host = process.env.SMTP_HOST;
        let username = process.env.SMTP_USERNAME;
        let password = process.env.SMTP_PASSWORD;

        return nodemailer.createTransport({
            host: "smtp.gmail.com", // SMTP server host
            port: 587,              // SMTP port for non-SSL (STARTTLS)
            secure: false,          // TLS security setting (false for STARTTLS)
            requireTLS: true,       // Require TLS for the connection
            auth: {
                user: "sakshisethi.mdb@gmail.com", // Placeholder credentials (use environment variables instead)
                pass: "wjstmftxjgibyyag",           // This should also use environment variables
            },
            logger: false           // Disable logging by nodemailer
        });
    }

    // Method to send an email using the provided options
    async sendMail(requestId: string | number | string[] | undefined, options: MailInterface) {
        // Check if email service is enabled
        if (this.enable != "enable") {
            return;
        }

        // Get transporter (connection to SMTP server)
        let transporter = await this.createConnection();

        // Send email with the specified options
        return await transporter
            .sendMail({
                from: `The Mad Brains <${process.env.SMTP_SENDER || options.from}>`, // Default sender with fallback to 'from' in options
                to: options.to,
                cc: options.cc,
                bcc: options.bcc,
                subject: options.subject,
                text: options.text,
                html: options.html,
            })
            .then((info) => {
                if (process.env.NODE_ENV === 'local') {
                    // Additional logging or actions for local environment
                }
                return info; // Return email info (e.g., message ID)
            });
    }

    // Verifies connection to the SMTP server (useful for ensuring configuration is correct)
    async verifyMailConnection(): Promise<void | boolean> {
        return false; // Early return for demonstration; replace with actual verification logic if needed

        let transporter = this.createConnection();

        // Verify SMTP configuration
        (await transporter).verify(function (error, success) {
            if (error) {
                console.log(error); // Log any errors
            } else {
                console.log("Server is ready to take our messages"); // Log success message
            }
        });
    }
}

export default MailService; // Export the MailService class

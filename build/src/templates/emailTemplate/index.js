"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// verifyEmail
const announcement_1 = __importDefault(require("./announcement"));
const conversionEmailTemplate_1 = __importDefault(require("./conversionEmailTemplate"));
const kycProcessTemplate_1 = __importDefault(require("./kycProcessTemplate"));
const loginEmailTemplate_1 = __importDefault(require("./loginEmailTemplate"));
const p2pBuyEmailTemplate_1 = __importDefault(require("./p2pBuyEmailTemplate"));
const passwordTemplate_1 = __importDefault(require("./passwordTemplate"));
const postEmailTemplate_1 = __importDefault(require("./postEmailTemplate"));
const twoFactorEmailTemplate_1 = __importDefault(require("./twoFactorEmailTemplate"));
const verifyEmailTemplate_1 = __importDefault(require("./verifyEmailTemplate"));
const withdrawRequestTemplate_1 = __importDefault(require("./withdrawRequestTemplate"));
const withdrawSentTemplate_1 = __importDefault(require("./withdrawSentTemplate"));
const withdrawSuccessTemplate_1 = __importDefault(require("./withdrawSuccessTemplate"));
class emailTemplates {
    /**
     * otp verification email template
     * @param otp
     * @returns
     */
    otpVerfication(otp) {
        return (0, verifyEmailTemplate_1.default)(otp);
    }
    /**
     * otp verification email template
     * @param otp
     * @returns
     */
    loginTemplate(ip, loginTime) {
        return (0, loginEmailTemplate_1.default)(ip, loginTime);
    }
    /**
     * kyc verification email template
     * @param
     * @returns
     */
    kycVerification(status) {
        return (0, kycProcessTemplate_1.default)(status);
    }
    /**
     * kyx verification email template
     * @param
     * @returns
     */
    withdrawVerification(otp, address, amount) {
        return (0, withdrawRequestTemplate_1.default)(otp, address, amount);
    }
    withdrawSuccess(address, amount, txid) {
        return (0, withdrawSuccessTemplate_1.default)(address, amount, txid);
    }
    withdrawSent(address, amount, fees) {
        return (0, withdrawSentTemplate_1.default)(address, amount, fees);
    }
    p2pBuyEmail(order_id, amount, seller, currency) {
        return (0, p2pBuyEmailTemplate_1.default)(order_id, amount, seller, currency);
    }
    conversionMail(converted, received, conversionRate, fees) {
        return (0, conversionEmailTemplate_1.default)(converted, received, conversionRate, fees);
    }
    twoFactorMail() {
        return (0, twoFactorEmailTemplate_1.default)();
    }
    passwordMail() {
        return (0, passwordTemplate_1.default)();
    }
    postMail() {
        return (0, postEmailTemplate_1.default)();
    }
    announcementMail() {
        return (0, announcement_1.default)();
    }
}
exports.default = emailTemplates;

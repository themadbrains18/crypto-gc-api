// verifyEmail
import Announcement from "./announcement";
import conversionEmailTemplate from "./conversionEmailTemplate";
import kycProcess from "./kycProcessTemplate";
import loginEmail from "./loginEmailTemplate";
import P2pBuyEmailTemplate from "./p2pBuyEmailTemplate";
import PasswordTemplate from "./passwordTemplate";
import PostEmailTemplate from "./postEmailTemplate";
import TwoFactorEmailTemplate from "./twoFactorEmailTemplate";
import verifyEmail from "./verifyEmailTemplate";
import withdrawEmail from "./withdrawRequestTemplate";
import withdrawSentEmail from "./withdrawSentTemplate";
import withdrawSuccessEmail from "./withdrawSuccessTemplate";


class emailTemplates {

    /**
     * otp verification email template
     * @param otp 
     * @returns 
     */
    otpVerfication (otp : string | number) {
        return verifyEmail(otp)
    }
    /**
     * otp verification email template
     * @param otp 
     * @returns 
     */
    loginTemplate (ip : string , loginTime:number | string) {
        return loginEmail(ip,loginTime)
    }
    /**
     * kyc verification email template
     * @param  
     * @returns 
     */
    kycVerification (status : string) {
        return kycProcess(status)
    }
    /**
     * kyx verification email template
     * @param  
     * @returns 
     */
   withdrawVerification (otp : string | number, address:string, amount:string | number) {
        return withdrawEmail(otp,address,amount)
    }
   withdrawSuccess ( address:string, amount:string | number, txid:string) {
        return withdrawSuccessEmail(address,amount,txid)
    }
   withdrawSent( address:string, amount:string | number, fees:string | number) {
        return withdrawSentEmail(address,amount,fees)
    }
   p2pBuyEmail( order_id:string, amount:string | number, seller:string, currency:string) {
        return P2pBuyEmailTemplate(order_id,amount,seller,currency)
    }
   conversionMail( converted:string,received: string ,conversionRate: string ,fees:string) {
        return conversionEmailTemplate(converted,received,conversionRate,fees)
    }
   twoFactorMail() {
        return TwoFactorEmailTemplate()
    }
   passwordMail() {
        return PasswordTemplate()
    }
  postMail() {
        return PostEmailTemplate()
    }
  announcementMail() {
        return Announcement()
    }

}

export default emailTemplates
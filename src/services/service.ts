import otpService from "./otp.service"
import bcryptService from "./bcrypt.service"
import userService from "./user.service";
import MailService from "../utils/notificaton.email"
import emailTemplates from "../templates/emailTemplate";
import otpGenerate from "../utils/otp.genrate";

import tokenServices from "./token.service";
import networkServices from "./network.service";

import jwt_token from "./jwt.service";
import kycServices from "./kyc.service";
import fileUpload from "../utils/multer";

import assetsService from "./assets.service";
import stakingService from "./staking.service";
import paymentMethodService from "./p_method.service";
import adsPostservice from "./adspost.service";
import p2pOrderService from "./p2porder.service";
import tokenListingService from "./tokenlisting.service";
import marketService from "./market.service";
import chatService from "./chat.service";
import walletService from "../blockchain/wallet.service";
import userWalletServices from "./wallet.service";
import withdrawServices from "./withdraw.service";
import profileServices from "./profile.service";

import ReferalService from "./referal.service";
import depositServices from "./deposit.service";
import convertService from "./convert.service";
import tradePairServices from "./tradepair.service";
import jsonFileReadWrite from "./filereadwrite.service";

import userNotificationService from "./user_notification.service";
import siteMaintenanceServices from "./site.service";

import futureTradePairServices from "./futurepair.service";

import futurePositionServices from "./futurePosition.service";
import futureOpenOrderServices from "./futureOpenOrder.service";

import watchlistServices from './watchlist.service';
import scannerService from "./scanner.service";

import referProgramService from "./referProgram.service";
import addressServices from "./address.service";

class service {
    otpService = new otpService();
    bcypt = new bcryptService();
    user = new userService();
    emailService = new MailService();
    emailTemplate = new emailTemplates();
    otpGenerate = new otpGenerate();
    jwt = new jwt_token();
    token = new tokenServices();
    network = new networkServices();
    kyc = new kycServices();
    upload = new fileUpload();
    assets = new assetsService();
    staking = new stakingService();
    p_method = new paymentMethodService();
    ads = new adsPostservice();
    p2p = new p2pOrderService();
    token_list = new tokenListingService();
    market = new marketService();
    chat = new chatService();
    walletService = new walletService();
    userWalletServices = new userWalletServices();
    withdrawServices = new withdrawServices();
    referalService = new ReferalService();
    profile = new profileServices();
    depositServices = new depositServices();
    convert = new convertService();
    pairServices = new tradePairServices();
    jsonFileReadWrite = new jsonFileReadWrite();
    notify = new userNotificationService();
    site = new siteMaintenanceServices();
    future = new futureTradePairServices();
    position = new futurePositionServices();
    openorder = new futureOpenOrderServices();
    watchlist = new watchlistServices();
    scan = new scannerService();
    refer = new referProgramService();
    address = new addressServices();
}

export default new service()
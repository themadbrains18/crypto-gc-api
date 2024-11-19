import { Model, Optional, Sequelize, Op } from "sequelize";
import config from "../config/db-init";
import userModel from "./model/users.model";
import userOtpModel from "./model/otps.model";
import assetModel from "./model/assets.model";
import tokensModel from "./model/tokens.model";
import postModel from "./model/post.model";
import withdrawModel from "./model/withdraw.model";
import userPmethodModel from "./model/user_p_method";
import chatModel from "./model/chat.model";
import depositModel from "./model/deposit.model";
import historyModel from "./model/history.model";
import kycModel from "./model/kyc.model";
import MarketProfitModel from "./model/marketProfit.model";
import networkModel from "./model/network.model";
import notificationModel from "./model/notification.model";
import orderModel from "./model/order.model";
import marketOrderModel from "./model/marketorder.model";
import marketOrderHistoryModel from "./model/marketOrderHistory.model";
import lastLoginModel from "./model/lastLogin.model";
import tokenstakeModel from "./model/tokenstake.model";
import transferhistoryModel from "./model/transferhistory.model";
import stakingModel from "./model/staking.model";
import paymentMethodModel from "./model/p_method.model";
import tokenListingModel from "./model/tokenListing.model";
import walletsModel from "./model/wallets.model";
import globalTokensModel from "./model/global_token.model";
import profileModel from "./model/profile.model";
import convertModel from "./model/convert.model";
import convertHistoryModel from "./model/convertHistory.model";
import tradePairModel from "./model/tradePair.model";
import userNotificationModel from "./model/user_notification.model";
import siteMaintenanceModel from "./model/sitemaintenace.model";
import futureTradePairModel from "./model/futuretrade.model";
import futurePositionModel from "./model/future_position.model";
import futureOpenOrderModel from "./model/future_open_order.model";
import watchlistModel from "./model/watchlist.model";
import AdminPayFeesModel from "./model/admin_pay_fees.model";
import referProgramModel from "./model/refer_program.model";
import referProgramInviteModel from "./model/refer_program_invite.model";
import referUserModel from "./model/refer_user.model";
import userRewardModel from "./model/rewards";
import userRewardTotalModel from "./model/rewards_total.model";
import userJwtTokenModel from "./model/userJwtToken.model";

// future trading history model
import futurePositionHistoryModel from "./model/future_position_history.model";
import addressModel from "./model/address.model";
import takeProfitStopLossModel from "./model/takeprofit_stoploss.model";

const isDev = process.env.NODE_ENV === "development";

let sequelize = new Sequelize(
  config().database.db_name,
  config().database.db_urname,
  config().database.db_pass,
  {
    host: config().database.db_host,
    port: config().database.db_port,
    logging: false,
    dialect:
      "mysql" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
    dialectOptions: {
      multipleStatements: true
    },
    timezone: "+05:30",
    pool: {
      max: 1024, // Maximum number of connections in pool
      min: 0, // Minimum number of connections in pool
      acquire: 30000, // Maximum time in ms to acquire a connection
      idle: 10000 // Maximum time in ms that a connection can be idle before being released
    }
  }
);

let isAlter = false;

let models = [
  userModel,
  chatModel,
  depositModel,
  userPmethodModel,
  userOtpModel,
  assetModel,
  withdrawModel,
  tokensModel,
  postModel,
  historyModel,
  kycModel,
  networkModel,
  MarketProfitModel,
  notificationModel,
  orderModel,
  marketOrderModel,
  lastLoginModel,
  marketOrderHistoryModel,
  tokenstakeModel,
  transferhistoryModel,
  stakingModel,
  paymentMethodModel,
  walletsModel,
  tokenListingModel,
  globalTokensModel,
  profileModel,
  convertModel,
  convertHistoryModel,
  tradePairModel,
  userNotificationModel,
  siteMaintenanceModel,
  futureTradePairModel,
  futurePositionModel,
  futureOpenOrderModel,
  futurePositionHistoryModel,
  watchlistModel,
  AdminPayFeesModel,
  referProgramModel,
  referProgramInviteModel,
  referUserModel,
  userRewardModel,
  userRewardTotalModel,
  userJwtTokenModel,
  addressModel,
  takeProfitStopLossModel
];

/**
 * database table initiliazation
 */
models.forEach((model) => model.initialize(sequelize));

(async function (): Promise<void> {
  try {
    // return
    if (!isAlter) {
      /**
       * Assets table associate with token table
       */
      userModel.hasMany(assetModel, { foreignKey: "user_id" });
      assetModel.belongsTo(userModel, { foreignKey: "user_id" });

      userModel.hasMany(lastLoginModel, { foreignKey: "user_id" });
      lastLoginModel.belongsTo(userModel, { foreignKey: "user_id" });


// // Establish one-to-one association between User and Profile
// userModel.hasOne(profileModel, { foreignKey: 'user_id', as: 'profile' });
// profileModel.belongsTo(userModel, { foreignKey: 'user_id', as: 'user' });


//       userModel.hasMany(userNotificationModel, { foreignKey: "user_id" });
//       userNotificationModel.belongsTo(userModel, { foreignKey: "user_id" });

  

      /**
       * Ads post table associate with User table
       */
      userModel.hasMany(postModel, { foreignKey: "user_id" });
      postModel.belongsTo(userModel, { foreignKey: "user_id" });

      userModel.hasOne(profileModel, { foreignKey: "user_id" });
      profileModel.belongsTo(userModel, { foreignKey: "user_id" });
      /**
       * Withdraw table associate with User table
       */
      userModel.hasMany(withdrawModel, { foreignKey: "user_id" });
      withdrawModel.belongsTo(userModel, { foreignKey: "user_id" });
      /**
       * market order table associate with User table
       */
      userModel.hasMany(marketOrderModel, { foreignKey: "user_id" });
      marketOrderModel.belongsTo(userModel, { foreignKey: "user_id" });
      /**
       * P2P order table associate with User table
       */
      // In your user model file
      userModel.hasMany(orderModel, { foreignKey: 'sell_user_id' });
      userModel.hasMany(orderModel, { foreignKey: 'buy_user_id' });

      // In your order model file
      orderModel.belongsTo(userModel, { foreignKey: 'sell_user_id' });
      orderModel.belongsTo(userModel, { foreignKey: 'buy_user_id' });

      /**
       * User Kyc table associate with User table
       */
      userModel.hasOne(kycModel, { foreignKey: "userid" });
      kycModel.belongsTo(kycModel, { foreignKey: "userid" });
      /**
       * Deposit table associate with User table
       */
      userModel.hasMany(depositModel, { foreignKey: "user_id" });
      depositModel.belongsTo(userModel, { foreignKey: "user_id" });

      userModel.hasMany(userPmethodModel, { foreignKey: "user_id" });
      userPmethodModel.belongsTo(userModel, { foreignKey: "user_id" });

      userModel.hasMany(walletsModel, { foreignKey: "user_id" });
      walletsModel.belongsTo(userModel, { foreignKey: "user_id" })

      // networkModel.hasMany(withdrawModel, { foreignKey: "networkId" });
      // withdrawModel.belongsTo(networkModel, { foreignKey: "networkId" });

      tokensModel.hasMany(assetModel, { foreignKey: "token_id" });
      assetModel.belongsTo(tokensModel, { foreignKey: "token_id" });

      tokensModel.hasMany(orderModel, { foreignKey: "token_id" });
      orderModel.belongsTo(tokensModel, { foreignKey: "token_id" });

      globalTokensModel.hasMany(orderModel, { foreignKey: "token_id" });
      orderModel.belongsTo(globalTokensModel, { foreignKey: "token_id" });

      globalTokensModel.hasMany(assetModel, { foreignKey: "token_id" });
      assetModel.belongsTo(globalTokensModel, { foreignKey: "token_id" });

      /**
       * Transfer History Model table associate with token table
       */
      tokensModel.hasMany(transferhistoryModel, { foreignKey: "token_id" });
      transferhistoryModel.belongsTo(tokensModel, { foreignKey: "token_id" });

      /**
       * Staking table associate with token table
       */
      tokensModel.hasMany(stakingModel, { foreignKey: "token_id" });
      stakingModel.belongsTo(tokensModel, { foreignKey: "token_id" });

      globalTokensModel.hasMany(stakingModel, { foreignKey: "token_id" });
      stakingModel.belongsTo(globalTokensModel, { foreignKey: "token_id" });

      tokensModel.hasMany(tokenstakeModel, { foreignKey: "token_id" });
      tokenstakeModel.belongsTo(tokensModel, { foreignKey: "token_id" });

      globalTokensModel.hasMany(tokenstakeModel, { foreignKey: "token_id" });
      tokenstakeModel.belongsTo(globalTokensModel, { foreignKey: "token_id" });

      /**
       * User payment method table associate with Master payment method table
       */
      paymentMethodModel.hasMany(userPmethodModel, { foreignKey: "pmid" });
      userPmethodModel.belongsTo(paymentMethodModel, { foreignKey: "pmid" });

      /**
       * Withdraw table associate with token table
       */
      tokensModel.hasMany(withdrawModel, { foreignKey: "tokenID" });
      withdrawModel.belongsTo(tokensModel, { foreignKey: "tokenID" });

      globalTokensModel.hasMany(withdrawModel, { foreignKey: "tokenID" });
      withdrawModel.belongsTo(globalTokensModel, { foreignKey: "tokenID" });

      networkModel.hasMany(withdrawModel, { foreignKey: "networkId" });
      withdrawModel.belongsTo(networkModel, { foreignKey: "networkId" });


      tokensModel.hasMany(addressModel, { foreignKey: "tokenID" });
      addressModel.belongsTo(tokensModel, { foreignKey: "tokenID" });

      globalTokensModel.hasMany(addressModel, { foreignKey: "tokenID" });
      addressModel.belongsTo(globalTokensModel, { foreignKey: "tokenID" });

      networkModel.hasMany(addressModel, { foreignKey: "networkId" });
      addressModel.belongsTo(networkModel, { foreignKey: "networkId" });

      tokensModel.hasMany(convertHistoryModel, { foreignKey: "token_id" });
      convertHistoryModel.belongsTo(tokensModel, { foreignKey: "token_id" });

      globalTokensModel.hasMany(convertHistoryModel, { foreignKey: "token_id" });
      convertHistoryModel.belongsTo(globalTokensModel, { foreignKey: "token_id" });

      /**
       * Deposit table associate with token table
       */
      tokensModel.hasMany(depositModel, { foreignKey: "coinName" });
      depositModel.belongsTo(tokensModel, { foreignKey: "coinName" });

      globalTokensModel.hasMany(depositModel, { foreignKey: "coinName" });
      depositModel.belongsTo(globalTokensModel, { foreignKey: "coinName" });

      postModel.hasOne(orderModel, { foreignKey: "post_id" });
      orderModel.belongsTo(postModel, { foreignKey: "post_id" });

      tokensModel.hasOne(marketOrderModel, { foreignKey: "token_id" });
      marketOrderModel.belongsTo(tokensModel, { foreignKey: "token_id" });

      globalTokensModel.hasMany(marketOrderModel, { foreignKey: "token_id" });
      marketOrderModel.belongsTo(globalTokensModel, { foreignKey: "token_id" });

      marketOrderModel.hasMany(marketOrderHistoryModel, {
        foreignKey: "order_id",
      });
      marketOrderHistoryModel.belongsTo(marketOrderModel, {
        foreignKey: "order_id",
      });

      /**
       * Ads post table associate with token table
       */
      tokensModel.hasMany(postModel, { foreignKey: "token_id" });
      postModel.belongsTo(tokensModel, { foreignKey: "token_id" });
      globalTokensModel.hasMany(postModel, { foreignKey: "token_id" });
      postModel.belongsTo(globalTokensModel, { foreignKey: "token_id" });


      /**
       * Trade pair model table associate with token table
       */

      tokensModel.hasOne(tradePairModel, { foreignKey: "tokenOne" });
      tradePairModel.belongsTo(tokensModel, { foreignKey: "tokenOne" });

      globalTokensModel.hasOne(tradePairModel, { foreignKey: "tokenOne" });
      tradePairModel.belongsTo(globalTokensModel, { foreignKey: "tokenOne" });

      /**
       * Future Trade pair model table associate with token table
       */

      tokensModel.hasOne(futureTradePairModel, { foreignKey: "coin_id" });
      futureTradePairModel.belongsTo(tokensModel, { foreignKey: "coin_id" });

      globalTokensModel.hasOne(futureTradePairModel, { foreignKey: "coin_id" });
      futureTradePairModel.belongsTo(globalTokensModel, { foreignKey: "coin_id" });

      /**
       * Future Position pair model table associate with token table
       */

      tokensModel.hasOne(futurePositionModel, { foreignKey: "coin_id" });
      futurePositionModel.belongsTo(tokensModel, { foreignKey: "coin_id" });

      globalTokensModel.hasOne(futurePositionModel, { foreignKey: "coin_id" });
      futurePositionModel.belongsTo(globalTokensModel, { foreignKey: "coin_id" });

      futurePositionModel.hasMany(futureOpenOrderModel, { foreignKey: "position_id" });
      futureOpenOrderModel.belongsTo(futurePositionModel, { foreignKey: "position_id" });

      futurePositionModel.hasMany(takeProfitStopLossModel, { foreignKey: "position_id" });
      takeProfitStopLossModel.belongsTo(futurePositionModel, { foreignKey: "position_id" });

      /**
       * watchlist table associate with token table
       * 
       */

      tokensModel.hasMany(watchlistModel, { foreignKey: "token_id" });
      watchlistModel.belongsTo(tokensModel, { foreignKey: "token_id" });

      globalTokensModel.hasMany(watchlistModel, { foreignKey: "token_id" });
      watchlistModel.belongsTo(globalTokensModel, { foreignKey: "token_id" });

      /**
       * Refer Program
       */

      referProgramModel.hasMany(referProgramInviteModel, { foreignKey: "referProgram_id" });
      referProgramInviteModel.belongsTo(referProgramModel, { foreignKey: "referProgram_id" });

      tokensModel.hasMany(referProgramInviteModel, { foreignKey: "token_id" });
      referProgramInviteModel.belongsTo(tokensModel, { foreignKey: "token_id" });

      globalTokensModel.hasMany(referProgramInviteModel, { foreignKey: "token_id" });
      referProgramInviteModel.belongsTo(globalTokensModel, { foreignKey: "token_id" });


      /**
       * Referal user and event associated
       */

      userModel.hasOne(referUserModel, { foreignKey: "user_id" });
      referUserModel.belongsTo(userModel, { foreignKey: "user_id" });

      referProgramInviteModel.hasOne(referUserModel, { foreignKey: "event_id" });
      referUserModel.belongsTo(referProgramInviteModel, { foreignKey: "event_id" });
    }

  } catch (error: any) {
    throw new Error(error.message);
  }
})().catch((err) => console.log(err));

// sequelize.sync({ alter: true });
// assetModel.sync({ alter: true });
// futureOpenOrderModel.sync({ alter: true });


//=============================================================

export {
  sequelize as Database,
  Op,
  userModel,
  userOtpModel,
  assetModel,
  tokensModel,
  postModel,
  withdrawModel,
  userPmethodModel,
  chatModel,
  depositModel,
  historyModel,
  MarketProfitModel,
  networkModel,
  notificationModel,
  orderModel,
  marketOrderModel,
  marketOrderHistoryModel,
  lastLoginModel,
  tokenstakeModel,
  kycModel,
  transferhistoryModel,
  stakingModel,
  paymentMethodModel,
  tokenListingModel,
  walletsModel,
  globalTokensModel,
  convertModel,
  convertHistoryModel,
  userNotificationModel,
  tradePairModel,
  siteMaintenanceModel,
  futureTradePairModel,
  futurePositionModel,
  futureOpenOrderModel,
  futurePositionHistoryModel,
  watchlistModel,
  AdminPayFeesModel,
  referProgramModel,
  referProgramInviteModel,
  referUserModel,
  userRewardModel,
  userRewardTotalModel,
  userJwtTokenModel,
  addressModel,
  takeProfitStopLossModel
};

export default sequelize;

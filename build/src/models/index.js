"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRewardTotalModel = exports.userRewardModel = exports.referUserModel = exports.referProgramInviteModel = exports.referProgramModel = exports.AdminPayFeesModel = exports.watchlistModel = exports.futurePositionHistoryModel = exports.futureOpenOrderModel = exports.futurePositionModel = exports.futureTradePairModel = exports.siteMaintenanceModel = exports.tradePairModel = exports.userNotificationModel = exports.convertHistoryModel = exports.convertModel = exports.globalTokensModel = exports.walletsModel = exports.tokenListingModel = exports.paymentMethodModel = exports.stakingModel = exports.transferhistoryModel = exports.kycModel = exports.tokenstakeModel = exports.lastLoginModel = exports.marketOrderHistoryModel = exports.marketOrderModel = exports.orderModel = exports.notificationModel = exports.networkModel = exports.MarketProfitModel = exports.historyModel = exports.depositModel = exports.chatModel = exports.userPmethodModel = exports.withdrawModel = exports.postModel = exports.tokensModel = exports.assetModel = exports.userOtpModel = exports.userModel = exports.Op = exports.Database = void 0;
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "Op", { enumerable: true, get: function () { return sequelize_1.Op; } });
const db_init_1 = __importDefault(require("../config/db-init"));
const users_model_1 = __importDefault(require("./model/users.model"));
exports.userModel = users_model_1.default;
const otps_model_1 = __importDefault(require("./model/otps.model"));
exports.userOtpModel = otps_model_1.default;
const assets_model_1 = __importDefault(require("./model/assets.model"));
exports.assetModel = assets_model_1.default;
const tokens_model_1 = __importDefault(require("./model/tokens.model"));
exports.tokensModel = tokens_model_1.default;
const post_model_1 = __importDefault(require("./model/post.model"));
exports.postModel = post_model_1.default;
const withdraw_model_1 = __importDefault(require("./model/withdraw.model"));
exports.withdrawModel = withdraw_model_1.default;
const user_p_method_1 = __importDefault(require("./model/user_p_method"));
exports.userPmethodModel = user_p_method_1.default;
const chat_model_1 = __importDefault(require("./model/chat.model"));
exports.chatModel = chat_model_1.default;
const deposit_model_1 = __importDefault(require("./model/deposit.model"));
exports.depositModel = deposit_model_1.default;
const history_model_1 = __importDefault(require("./model/history.model"));
exports.historyModel = history_model_1.default;
const kyc_model_1 = __importDefault(require("./model/kyc.model"));
exports.kycModel = kyc_model_1.default;
const marketProfit_model_1 = __importDefault(require("./model/marketProfit.model"));
exports.MarketProfitModel = marketProfit_model_1.default;
const network_model_1 = __importDefault(require("./model/network.model"));
exports.networkModel = network_model_1.default;
const notification_model_1 = __importDefault(require("./model/notification.model"));
exports.notificationModel = notification_model_1.default;
const order_model_1 = __importDefault(require("./model/order.model"));
exports.orderModel = order_model_1.default;
const marketorder_model_1 = __importDefault(require("./model/marketorder.model"));
exports.marketOrderModel = marketorder_model_1.default;
const marketOrderHistory_model_1 = __importDefault(require("./model/marketOrderHistory.model"));
exports.marketOrderHistoryModel = marketOrderHistory_model_1.default;
const lastLogin_model_1 = __importDefault(require("./model/lastLogin.model"));
exports.lastLoginModel = lastLogin_model_1.default;
const tokenstake_model_1 = __importDefault(require("./model/tokenstake.model"));
exports.tokenstakeModel = tokenstake_model_1.default;
const transferhistory_model_1 = __importDefault(require("./model/transferhistory.model"));
exports.transferhistoryModel = transferhistory_model_1.default;
const staking_model_1 = __importDefault(require("./model/staking.model"));
exports.stakingModel = staking_model_1.default;
const p_method_model_1 = __importDefault(require("./model/p_method.model"));
exports.paymentMethodModel = p_method_model_1.default;
const tokenListing_model_1 = __importDefault(require("./model/tokenListing.model"));
exports.tokenListingModel = tokenListing_model_1.default;
const wallets_model_1 = __importDefault(require("./model/wallets.model"));
exports.walletsModel = wallets_model_1.default;
const global_token_model_1 = __importDefault(require("./model/global_token.model"));
exports.globalTokensModel = global_token_model_1.default;
const profile_model_1 = __importDefault(require("./model/profile.model"));
const convert_model_1 = __importDefault(require("./model/convert.model"));
exports.convertModel = convert_model_1.default;
const convertHistory_model_1 = __importDefault(require("./model/convertHistory.model"));
exports.convertHistoryModel = convertHistory_model_1.default;
const tradePair_model_1 = __importDefault(require("./model/tradePair.model"));
exports.tradePairModel = tradePair_model_1.default;
const user_notification_model_1 = __importDefault(require("./model/user_notification.model"));
exports.userNotificationModel = user_notification_model_1.default;
const sitemaintenace_model_1 = __importDefault(require("./model/sitemaintenace.model"));
exports.siteMaintenanceModel = sitemaintenace_model_1.default;
const futuretrade_model_1 = __importDefault(require("./model/futuretrade.model"));
exports.futureTradePairModel = futuretrade_model_1.default;
const future_position_model_1 = __importDefault(require("./model/future_position.model"));
exports.futurePositionModel = future_position_model_1.default;
const future_open_order_model_1 = __importDefault(require("./model/future_open_order.model"));
exports.futureOpenOrderModel = future_open_order_model_1.default;
const watchlist_model_1 = __importDefault(require("./model/watchlist.model"));
exports.watchlistModel = watchlist_model_1.default;
const admin_pay_fees_model_1 = __importDefault(require("./model/admin_pay_fees.model"));
exports.AdminPayFeesModel = admin_pay_fees_model_1.default;
const refer_program_model_1 = __importDefault(require("./model/refer_program.model"));
exports.referProgramModel = refer_program_model_1.default;
const refer_program_invite_model_1 = __importDefault(require("./model/refer_program_invite.model"));
exports.referProgramInviteModel = refer_program_invite_model_1.default;
const refer_user_model_1 = __importDefault(require("./model/refer_user.model"));
exports.referUserModel = refer_user_model_1.default;
const rewards_1 = __importDefault(require("./model/rewards"));
exports.userRewardModel = rewards_1.default;
const rewards_total_model_1 = __importDefault(require("./model/rewards_total.model"));
exports.userRewardTotalModel = rewards_total_model_1.default;
// future trading history model
const future_position_history_model_1 = __importDefault(require("./model/future_position_history.model"));
exports.futurePositionHistoryModel = future_position_history_model_1.default;
const isDev = process.env.NODE_ENV === "development";
let sequelize = new sequelize_1.Sequelize((0, db_init_1.default)().database.db_name, (0, db_init_1.default)().database.db_urname, (0, db_init_1.default)().database.db_pass, {
    host: (0, db_init_1.default)().database.db_host,
    port: (0, db_init_1.default)().database.db_port,
    logging: false,
    dialect: "mysql" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
    timezone: "+05:30"
});
exports.Database = sequelize;
let isAlter = false;
let models = [
    users_model_1.default,
    chat_model_1.default,
    deposit_model_1.default,
    user_p_method_1.default,
    otps_model_1.default,
    assets_model_1.default,
    withdraw_model_1.default,
    tokens_model_1.default,
    post_model_1.default,
    history_model_1.default,
    kyc_model_1.default,
    network_model_1.default,
    marketProfit_model_1.default,
    notification_model_1.default,
    order_model_1.default,
    marketorder_model_1.default,
    lastLogin_model_1.default,
    marketOrderHistory_model_1.default,
    tokenstake_model_1.default,
    transferhistory_model_1.default,
    staking_model_1.default,
    p_method_model_1.default,
    wallets_model_1.default,
    tokenListing_model_1.default,
    global_token_model_1.default,
    profile_model_1.default,
    convert_model_1.default,
    convertHistory_model_1.default,
    tradePair_model_1.default,
    user_notification_model_1.default,
    sitemaintenace_model_1.default,
    futuretrade_model_1.default,
    future_position_model_1.default,
    future_open_order_model_1.default,
    future_position_history_model_1.default,
    watchlist_model_1.default,
    admin_pay_fees_model_1.default,
    refer_program_model_1.default,
    refer_program_invite_model_1.default,
    refer_user_model_1.default,
    rewards_1.default,
    rewards_total_model_1.default
];
/**
 * database table initiliazation
 */
models.forEach((model) => model.initialize(sequelize));
(async function () {
    try {
        // return
        if (!isAlter) {
            /**
             * Assets table associate with token table
             */
            users_model_1.default.hasMany(assets_model_1.default, { foreignKey: "user_id" });
            assets_model_1.default.belongsTo(users_model_1.default, { foreignKey: "user_id" });
            users_model_1.default.hasMany(lastLogin_model_1.default, { foreignKey: "user_id" });
            lastLogin_model_1.default.belongsTo(users_model_1.default, { foreignKey: "user_id" });
            /**
             * Ads post table associate with User table
             */
            users_model_1.default.hasMany(post_model_1.default, { foreignKey: "user_id" });
            post_model_1.default.belongsTo(users_model_1.default, { foreignKey: "user_id" });
            users_model_1.default.hasOne(profile_model_1.default, { foreignKey: "user_id" });
            profile_model_1.default.belongsTo(users_model_1.default, { foreignKey: "user_id" });
            /**
             * Withdraw table associate with User table
             */
            users_model_1.default.hasMany(withdraw_model_1.default, { foreignKey: "user_id" });
            withdraw_model_1.default.belongsTo(users_model_1.default, { foreignKey: "user_id" });
            /**
             * market order table associate with User table
             */
            users_model_1.default.hasMany(marketorder_model_1.default, { foreignKey: "user_id" });
            marketorder_model_1.default.belongsTo(users_model_1.default, { foreignKey: "user_id" });
            /**
             * P2P order table associate with User table
             */
            users_model_1.default.hasMany(order_model_1.default, { foreignKey: "buy_user_id" });
            order_model_1.default.belongsTo(users_model_1.default, { foreignKey: "buy_user_id" });
            /**
             * User Kyc table associate with User table
             */
            users_model_1.default.hasOne(kyc_model_1.default, { foreignKey: "userid" });
            kyc_model_1.default.belongsTo(kyc_model_1.default, { foreignKey: "userid" });
            /**
             * Deposit table associate with User table
             */
            users_model_1.default.hasMany(deposit_model_1.default, { foreignKey: "user_id" });
            deposit_model_1.default.belongsTo(users_model_1.default, { foreignKey: "user_id" });
            users_model_1.default.hasMany(user_p_method_1.default, { foreignKey: "user_id" });
            user_p_method_1.default.belongsTo(users_model_1.default, { foreignKey: "user_id" });
            users_model_1.default.hasMany(wallets_model_1.default, { foreignKey: "user_id" });
            wallets_model_1.default.belongsTo(users_model_1.default, { foreignKey: "user_id" });
            // networkModel.hasMany(withdrawModel, { foreignKey: "networkId" });
            // withdrawModel.belongsTo(networkModel, { foreignKey: "networkId" });
            tokens_model_1.default.hasMany(assets_model_1.default, { foreignKey: "token_id" });
            assets_model_1.default.belongsTo(tokens_model_1.default, { foreignKey: "token_id" });
            tokens_model_1.default.hasMany(order_model_1.default, { foreignKey: "token_id" });
            order_model_1.default.belongsTo(tokens_model_1.default, { foreignKey: "token_id" });
            global_token_model_1.default.hasMany(order_model_1.default, { foreignKey: "token_id" });
            order_model_1.default.belongsTo(global_token_model_1.default, { foreignKey: "token_id" });
            global_token_model_1.default.hasMany(assets_model_1.default, { foreignKey: "token_id" });
            assets_model_1.default.belongsTo(global_token_model_1.default, { foreignKey: "token_id" });
            /**
             * Transfer History Model table associate with token table
             */
            tokens_model_1.default.hasMany(transferhistory_model_1.default, { foreignKey: "token_id" });
            transferhistory_model_1.default.belongsTo(tokens_model_1.default, { foreignKey: "token_id" });
            /**
             * Staking table associate with token table
             */
            tokens_model_1.default.hasMany(staking_model_1.default, { foreignKey: "token_id" });
            staking_model_1.default.belongsTo(tokens_model_1.default, { foreignKey: "token_id" });
            global_token_model_1.default.hasMany(staking_model_1.default, { foreignKey: "token_id" });
            staking_model_1.default.belongsTo(global_token_model_1.default, { foreignKey: "token_id" });
            tokens_model_1.default.hasMany(tokenstake_model_1.default, { foreignKey: "token_id" });
            tokenstake_model_1.default.belongsTo(tokens_model_1.default, { foreignKey: "token_id" });
            global_token_model_1.default.hasMany(tokenstake_model_1.default, { foreignKey: "token_id" });
            tokenstake_model_1.default.belongsTo(global_token_model_1.default, { foreignKey: "token_id" });
            /**
             * User payment method table associate with Master payment method table
             */
            p_method_model_1.default.hasMany(user_p_method_1.default, { foreignKey: "pmid" });
            user_p_method_1.default.belongsTo(p_method_model_1.default, { foreignKey: "pmid" });
            /**
             * Withdraw table associate with token table
             */
            tokens_model_1.default.hasMany(withdraw_model_1.default, { foreignKey: "tokenID" });
            withdraw_model_1.default.belongsTo(tokens_model_1.default, { foreignKey: "tokenID" });
            global_token_model_1.default.hasMany(withdraw_model_1.default, { foreignKey: "tokenID" });
            withdraw_model_1.default.belongsTo(global_token_model_1.default, { foreignKey: "tokenID" });
            network_model_1.default.hasMany(withdraw_model_1.default, { foreignKey: "networkId" });
            withdraw_model_1.default.belongsTo(network_model_1.default, { foreignKey: "networkId" });
            tokens_model_1.default.hasMany(convertHistory_model_1.default, { foreignKey: "token_id" });
            convertHistory_model_1.default.belongsTo(tokens_model_1.default, { foreignKey: "token_id" });
            global_token_model_1.default.hasMany(convertHistory_model_1.default, { foreignKey: "token_id" });
            convertHistory_model_1.default.belongsTo(global_token_model_1.default, { foreignKey: "token_id" });
            /**
             * Deposit table associate with token table
             */
            tokens_model_1.default.hasMany(deposit_model_1.default, { foreignKey: "coinName" });
            deposit_model_1.default.belongsTo(tokens_model_1.default, { foreignKey: "coinName" });
            global_token_model_1.default.hasMany(deposit_model_1.default, { foreignKey: "coinName" });
            deposit_model_1.default.belongsTo(global_token_model_1.default, { foreignKey: "coinName" });
            post_model_1.default.hasOne(order_model_1.default, { foreignKey: "post_id" });
            order_model_1.default.belongsTo(post_model_1.default, { foreignKey: "post_id" });
            tokens_model_1.default.hasOne(marketorder_model_1.default, { foreignKey: "token_id" });
            marketorder_model_1.default.belongsTo(tokens_model_1.default, { foreignKey: "token_id" });
            global_token_model_1.default.hasMany(marketorder_model_1.default, { foreignKey: "token_id" });
            marketorder_model_1.default.belongsTo(global_token_model_1.default, { foreignKey: "token_id" });
            marketorder_model_1.default.hasMany(marketOrderHistory_model_1.default, {
                foreignKey: "order_id",
            });
            marketOrderHistory_model_1.default.belongsTo(marketorder_model_1.default, {
                foreignKey: "order_id",
            });
            /**
             * Ads post table associate with token table
             */
            tokens_model_1.default.hasMany(post_model_1.default, { foreignKey: "token_id" });
            post_model_1.default.belongsTo(tokens_model_1.default, { foreignKey: "token_id" });
            global_token_model_1.default.hasMany(post_model_1.default, { foreignKey: "token_id" });
            post_model_1.default.belongsTo(global_token_model_1.default, { foreignKey: "token_id" });
            /**
             * Trade pair model table associate with token table
             */
            tokens_model_1.default.hasOne(tradePair_model_1.default, { foreignKey: "tokenOne" });
            tradePair_model_1.default.belongsTo(tokens_model_1.default, { foreignKey: "tokenOne" });
            global_token_model_1.default.hasOne(tradePair_model_1.default, { foreignKey: "tokenOne" });
            tradePair_model_1.default.belongsTo(global_token_model_1.default, { foreignKey: "tokenOne" });
            /**
             * Future Trade pair model table associate with token table
             */
            tokens_model_1.default.hasOne(futuretrade_model_1.default, { foreignKey: "coin_id" });
            futuretrade_model_1.default.belongsTo(tokens_model_1.default, { foreignKey: "coin_id" });
            global_token_model_1.default.hasOne(futuretrade_model_1.default, { foreignKey: "coin_id" });
            futuretrade_model_1.default.belongsTo(global_token_model_1.default, { foreignKey: "coin_id" });
            /**
             * Future Position pair model table associate with token table
             */
            tokens_model_1.default.hasOne(future_position_model_1.default, { foreignKey: "coin_id" });
            future_position_model_1.default.belongsTo(tokens_model_1.default, { foreignKey: "coin_id" });
            global_token_model_1.default.hasOne(future_position_model_1.default, { foreignKey: "coin_id" });
            future_position_model_1.default.belongsTo(global_token_model_1.default, { foreignKey: "coin_id" });
            future_position_model_1.default.hasMany(future_open_order_model_1.default, { foreignKey: "position_id" });
            future_open_order_model_1.default.belongsTo(future_position_model_1.default, { foreignKey: "position_id" });
            /**
             * watchlist table associate with token table
             *
             */
            tokens_model_1.default.hasMany(watchlist_model_1.default, { foreignKey: "token_id" });
            watchlist_model_1.default.belongsTo(tokens_model_1.default, { foreignKey: "token_id" });
            global_token_model_1.default.hasMany(watchlist_model_1.default, { foreignKey: "token_id" });
            watchlist_model_1.default.belongsTo(global_token_model_1.default, { foreignKey: "token_id" });
            /**
             * Refer Program
             */
            refer_program_model_1.default.hasMany(refer_program_invite_model_1.default, { foreignKey: "referProgram_id" });
            refer_program_invite_model_1.default.belongsTo(refer_program_model_1.default, { foreignKey: "referProgram_id" });
            tokens_model_1.default.hasMany(refer_program_invite_model_1.default, { foreignKey: "token_id" });
            refer_program_invite_model_1.default.belongsTo(tokens_model_1.default, { foreignKey: "token_id" });
            global_token_model_1.default.hasMany(refer_program_invite_model_1.default, { foreignKey: "token_id" });
            refer_program_invite_model_1.default.belongsTo(global_token_model_1.default, { foreignKey: "token_id" });
            /**
             * Referal user and event associated
             */
            users_model_1.default.hasOne(refer_user_model_1.default, { foreignKey: "user_id" });
            refer_user_model_1.default.belongsTo(users_model_1.default, { foreignKey: "user_id" });
            refer_program_invite_model_1.default.hasOne(refer_user_model_1.default, { foreignKey: "event_id" });
            refer_user_model_1.default.belongsTo(refer_program_invite_model_1.default, { foreignKey: "event_id" });
        }
    }
    catch (error) {
        throw new Error(error.message);
    }
})().catch((err) => console.log(err));
exports.default = sequelize;

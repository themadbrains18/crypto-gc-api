"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marektTypeEnum = exports.tokenTypeEnum = exports.marketOrderEnum = exports.stakingTimeFormat = exports.assetsWalletType = exports.assetsAccountType = exports.Direction = void 0;
var Direction;
(function (Direction) {
    Direction["Pending"] = "Pending";
    Direction["Approved"] = "Approved";
    Direction["All"] = "All";
    Direction["Rejected"] = "Rejected";
    Direction["Blank"] = "{type}";
})(Direction || (exports.Direction = Direction = {}));
var assetsAccountType;
(function (assetsAccountType) {
    assetsAccountType["main_account"] = "Main Account";
    assetsAccountType["funding_account"] = "Funding Account";
    assetsAccountType["trading_account"] = "Trading Account";
})(assetsAccountType || (exports.assetsAccountType = assetsAccountType = {}));
var assetsWalletType;
(function (assetsWalletType) {
    assetsWalletType["main_wallet"] = "main_wallet";
    assetsWalletType["funding_wallet"] = "funding_wallet";
    assetsWalletType["trading_wallet"] = "trading_wallet";
})(assetsWalletType || (exports.assetsWalletType = assetsWalletType = {}));
var stakingTimeFormat;
(function (stakingTimeFormat) {
    stakingTimeFormat["Minutes"] = "Minutes";
    stakingTimeFormat["Days"] = "Days";
    stakingTimeFormat["Months"] = "Months";
    stakingTimeFormat["Years"] = "Years";
})(stakingTimeFormat || (exports.stakingTimeFormat = stakingTimeFormat = {}));
var marketOrderEnum;
(function (marketOrderEnum) {
    marketOrderEnum["buy"] = "buy";
    marketOrderEnum["sell"] = "sell";
})(marketOrderEnum || (exports.marketOrderEnum = marketOrderEnum = {}));
var tokenTypeEnum;
(function (tokenTypeEnum) {
    tokenTypeEnum["global"] = "global";
    tokenTypeEnum["mannual"] = "mannual";
})(tokenTypeEnum || (exports.tokenTypeEnum = tokenTypeEnum = {}));
var marektTypeEnum;
(function (marektTypeEnum) {
    marektTypeEnum["market"] = "market";
    marektTypeEnum["limit"] = "limit";
})(marektTypeEnum || (exports.marektTypeEnum = marektTypeEnum = {}));

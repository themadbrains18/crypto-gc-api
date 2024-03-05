"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
//* validators/index.js
const register_validator_1 = __importDefault(require("./register.validator"));
const token_validator_1 = __importDefault(require("./token.validator"));
const post_validator_1 = __importDefault(require("./post.validator"));
const kyc_validator_1 = __importDefault(require("./kyc.validator"));
const staking_validator_1 = __importDefault(require("./staking.validator"));
const setting_validator_1 = __importDefault(require("./setting.validator"));
const profile_validator_1 = __importDefault(require("./profile.validator"));
module.exports = {
    register: register_validator_1.default,
    login: token_validator_1.default,
    post: post_validator_1.default,
    kyc: kyc_validator_1.default,
    stakingSchema: staking_validator_1.default,
    settingSchema: setting_validator_1.default,
    profileSchema: profile_validator_1.default
};

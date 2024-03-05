"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const models_2 = require("../models");
const profile_dal_1 = __importDefault(require("../models/dal/profile.dal"));
const profile_model_1 = __importDefault(require("../models/model/profile.model"));
class profileServices {
    async create(payload) {
        return await profile_dal_1.default.profileCreate(payload);
    }
    async getProfile(user_id) {
        let apiStatus = await profile_model_1.default.findOne({
            where: { user_id: user_id },
            include: [{
                    model: models_2.userModel,
                    include: [
                        { model: models_2.kycModel }
                    ],
                    attributes: {
                        exclude: [
                            "password",
                            "deletedAt",
                            "cronStatus",
                            "updatedAt",
                            "UID",
                            "antiphishing",
                            "registerType",
                            "statusType",
                            "TwoFA",
                            "otpToken", "own_code",
                            "refeer_code", "secret"
                        ],
                    }
                }]
        });
        if (apiStatus) {
            return apiStatus;
        }
        else {
            return { messgae: 'Profile information not updated!!' };
        }
    }
    async getActivity(user_id) {
        let activity = await models_1.lastLoginModel.findAll({ where: { user_id: user_id }, raw: true });
        if (activity) {
            return activity;
        }
        else {
            return { messgae: 'Activity information not updated!!' };
        }
    }
    async saveDp(payload) {
        return await profile_dal_1.default.profileDPCreate(payload);
    }
}
exports.default = profileServices;

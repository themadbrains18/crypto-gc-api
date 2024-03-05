"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_controller_1 = __importDefault(require("../../controllers/main.controller"));
const profile_model_1 = __importDefault(require("../model/profile.model"));
class profileDal extends main_controller_1.default {
    async profileCreate(payload) {
        try {
            let profile = await profile_model_1.default.findOne({ where: { user_id: payload.user_id }, raw: true });
            if (profile) {
                let response = await profile_model_1.default.update(payload, { where: { user_id: payload.user_id } });
                if (response) {
                    profile = await profile_model_1.default.findOne({ where: { user_id: payload.user_id }, raw: true });
                }
            }
            else {
                profile = await profile_model_1.default.create(payload);
            }
            return profile;
        }
        catch (error) {
        }
    }
    async profileDPCreate(payload) {
        try {
            let profile = await profile_model_1.default.findOne({ where: { user_id: payload.user_id }, raw: true });
            if (profile) {
                let response = await profile_model_1.default.update({ image: payload.image }, { where: { user_id: payload.user_id } });
                if (response) {
                    profile = await profile_model_1.default.findOne({ where: { user_id: payload.user_id }, raw: true });
                }
            }
            else {
                profile = await profile_model_1.default.create(payload);
            }
            return profile;
        }
        catch (error) {
            return error;
        }
    }
}
exports.default = new profileDal();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const staking_dal_1 = __importDefault(require("../models/dal/staking.dal"));
class stakingService {
    /**
     *
     * @param payload
     * @returns
     */
    async create(payload) {
        return await staking_dal_1.default.createStaking(payload);
    }
    async getAllStaking(user_id) {
        return await staking_dal_1.default.getAllStaking(user_id);
    }
    async getStakingByToken(token_id, user_id) {
        return await staking_dal_1.default.getStakingDataByTokenId(token_id, user_id);
    }
    async compareDates(d1, d2) {
        let date1 = new Date(d1).getTime();
        let date2 = new Date(d2).getTime();
        if (date1 < date2) {
            return true;
        }
        else if (date1 > date2) {
            return false;
        }
        else {
            return true;
        }
    }
    ;
    async stakingCron() {
        staking_dal_1.default.cronStaking();
    }
    async releaseStaking(payload) {
        return await staking_dal_1.default.releaseStaking(payload);
    }
    async createStake(payload) {
        return await staking_dal_1.default.createAdminStaking(payload);
    }
}
exports.default = stakingService;

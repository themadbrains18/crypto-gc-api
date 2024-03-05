"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const site_dal_1 = __importDefault(require("../models/dal/site.dal"));
class siteMaintenanceServices {
    /**
     *
     * @returns return all published token
     */
    async all() {
        return await site_dal_1.default.all();
    }
    async create(payload) {
        return await site_dal_1.default.createSiteMaintenance(payload);
    }
    async checkExist(id) {
        return await models_1.siteMaintenanceModel.findOne({ where: { id: id }, raw: true });
    }
    async edit(payload) {
        return await site_dal_1.default.editSiteMaintenance(payload);
    }
    async updateStatus(payload) {
        return await site_dal_1.default.changeStatus(payload);
    }
}
exports.default = siteMaintenanceServices;

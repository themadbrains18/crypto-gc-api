"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const referProgram_dal_1 = __importDefault(require("../models/dal/referProgram.dal"));
class referProgramService {
    /**
     *
     * @param payload
     * @returns
     */
    async create(payload) {
        return await referProgram_dal_1.default.createReferProgram(payload);
    }
    async editProgram(payload) {
        return await referProgram_dal_1.default.editReferProgram(payload);
    }
    async changeStatus(payload) {
        return await referProgram_dal_1.default.changeStatus(payload);
    }
    async createInvite(payload) {
        return await referProgram_dal_1.default.createReferProgramInvite(payload);
    }
    async getAllProgram() {
        return await referProgram_dal_1.default.getAllProgram();
    }
    async getProgramByLimit(offset, limit) {
        return await referProgram_dal_1.default.getProgramByLimit(offset, limit);
    }
    async getActiveProgramEvent() {
        return await referProgram_dal_1.default.getAllProgramEvent();
    }
    async getSingleEvent(payload) {
        return await referProgram_dal_1.default.getSingleEvent(payload);
    }
}
exports.default = referProgramService;

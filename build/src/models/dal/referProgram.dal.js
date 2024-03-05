"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const refer_program_model_1 = __importDefault(require("../model/refer_program.model"));
const main_controller_1 = __importDefault(require("../../controllers/main.controller"));
const refer_program_invite_model_1 = __importDefault(require("../model/refer_program_invite.model"));
const service_1 = __importDefault(require("../../services/service"));
class referProgramDal extends main_controller_1.default {
    /**
     *
     * @param payload
     * @returns
     */
    async createReferProgram(payload) {
        try {
            let response = await refer_program_model_1.default.create(payload);
            return response;
        }
        catch (error) {
            console.log(error);
        }
    }
    async editReferProgram(payload) {
        try {
            return await refer_program_model_1.default.update(payload, { where: { id: payload.id } });
        }
        catch (error) {
            console.log(error);
        }
    }
    async changeStatus(payload) {
        try {
            let apiStatus;
            let pair = await refer_program_model_1.default.findOne({ where: { id: payload?.id }, raw: true });
            if (pair) {
                apiStatus = await refer_program_model_1.default.update({ status: pair?.status == true ? false : true }, { where: { id: payload.id } });
            }
            return apiStatus;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async createReferProgramInvite(payload) {
        try {
            payload.referral_id = await service_1.default.otpGenerate.referalCodeGenerate();
            let response = await refer_program_invite_model_1.default.create(payload);
            return response;
        }
        catch (error) {
            console.log(error);
        }
    }
    async getAllProgram() {
        try {
            let referProgram = await refer_program_model_1.default.findAll({
                include: [{
                        model: refer_program_invite_model_1.default
                    }]
            });
            return referProgram;
        }
        catch (error) {
            console.log(error.message);
        }
    }
    async getProgramByLimit(offset, limit) {
        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            let referProgram = await refer_program_model_1.default.findAll({
                limit: limits, offset: offsets,
                include: [{
                        model: refer_program_invite_model_1.default
                    }]
            });
            return referProgram;
        }
        catch (error) {
            console.log(error.message);
        }
    }
    // Get Active Program Event
    async getAllProgramEvent() {
        try {
            let referProgram = await refer_program_model_1.default.findAll({
                where: { status: true },
                include: [{
                        model: refer_program_invite_model_1.default
                    }]
            });
            return referProgram;
        }
        catch (error) {
            console.log(error.message);
        }
    }
    async getSingleEvent(payload) {
        try {
            let referProgram = await refer_program_model_1.default.findOne({
                where: { name: payload },
                include: [{
                        model: refer_program_invite_model_1.default
                    }]
            });
            return referProgram;
        }
        catch (error) {
            console.log(error.message);
        }
    }
}
exports.default = new referProgramDal();

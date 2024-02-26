
import referProgramModel, { referProgramInput, referProgramOuput } from "../model/refer_program.model";
import BaseController from "../../controllers/main.controller";
import referProgramInviteModel, { referProgramInviteInput, referProgramInviteOuput } from "../model/refer_program_invite.model";
import service from "../../services/service";
import { updateReferProgramStatus } from "../../utils/interface";

class referProgramDal extends BaseController {

    /**
     * 
     * @param payload 
     * @returns 
     */
    async createReferProgram(payload: referProgramInput): Promise<referProgramOuput | any> {
        try {
            let response = await referProgramModel.create(payload);

            return response;
        } catch (error) {
            console.log(error);
        }

    }

    async editReferProgram(payload: referProgramInput): Promise<referProgramOuput | any> {
        try {

            return await referProgramModel.update(payload, { where: { id: payload.id } });

        } catch (error) {
            console.log(error)
        }
    }

    async changeStatus(payload: updateReferProgramStatus): Promise<any> {
        try {

            let apiStatus;
            let pair: any = await referProgramModel.findOne({ where: { id: payload?.id }, raw: true });
            if (pair) {
                apiStatus = await referProgramModel.update({ status: pair?.status == true ? false : true }, { where: { id: payload.id } });
            }

            return apiStatus;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async createReferProgramInvite(payload: referProgramInviteInput): Promise<referProgramInviteOuput | any> {
        try {

            payload.referral_id = await service.otpGenerate.referalCodeGenerate();

            let response = await referProgramInviteModel.create(payload);

            return response;
        } catch (error) {
            console.log(error);
        }

    }

    async getAllProgram(): Promise<referProgramOuput | any> {

        try {
            let referProgram = await referProgramModel.findAll({
                include: [{
                    model: referProgramInviteModel
                }]
            });

            return referProgram

        } catch (error: any) {
            console.log(error.message);
        }
    }

    async getProgramByLimit(offset: any, limit: any): Promise<referProgramOuput | any> {

        try {
            let offsets = parseInt(offset);
            let limits = parseInt(limit);
            let referProgram = await referProgramModel.findAll({
                limit: limits, offset: offsets,
                include: [{
                    model: referProgramInviteModel
                }]
            });

            return referProgram

        } catch (error: any) {
            console.log(error.message);
        }
    }


    // Get Active Program Event
    async getAllProgramEvent(): Promise<referProgramOuput | any> {

        try {
            let referProgram = await referProgramModel.findAll({
                where: { status: true },
                include: [{
                    model: referProgramInviteModel
                }]
            });

            return referProgram

        } catch (error: any) {
            console.log(error.message);
        }
    }


    async getSingleEvent(payload : string): Promise<referProgramOuput | any> {

        try {
            let referProgram = await referProgramModel.findOne({
                where: { name : payload},
                include: [{
                    model: referProgramInviteModel
                }]
            });

            return referProgram

        } catch (error: any) {
            console.log(error.message);
        }
    }

}

export default new referProgramDal();
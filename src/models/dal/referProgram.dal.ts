
import referProgramModel, { referProgramInput, referProgramOuput } from "../model/refer_program.model";
import BaseController from "../../controllers/main.controller";
import referProgramInviteModel, { referProgramInviteInput, referProgramInviteOuput } from "../model/refer_program_invite.model";
import service from "../../services/service";
import { updateReferProgramStatus } from "../../utils/interface";

class referProgramDal extends BaseController {


    /**
     * Create a new referral program.
     * 
     * @param payload - The data for creating a new referral program.
     * 
     * @returns A Promise that resolves to the created referral program record.
     * @throws Will throw an error if the creation fails.
     */
    async createReferProgram(payload: referProgramInput): Promise<referProgramOuput | any> {
        try {
            let response = await referProgramModel.create(payload);

            return response;
        } catch (error) {
            console.log(error);
        }

    }

    /**
     * Edit an existing referral program.
     * 
     * @param payload - The updated data for the referral program.
     * 
     * @returns A Promise that resolves to the number of affected rows.
     * @throws Will throw an error if the update fails.
     */
    async editReferProgram(payload: referProgramInput): Promise<referProgramOuput | any> {
        try {

            return await referProgramModel.update(payload, { where: { id: payload.id } });

        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Change the status of a referral program (active/inactive).
     * 
     * @param payload - The input containing the ID of the referral program to update.
     * 
     * @returns A Promise that resolves to the updated status of the referral program.
     * @throws Will throw an error if the update fails.
     */
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

    /**
     * Create a new referral invite for a referral program.
     * Generates a unique referral code and creates an invite record.
     * 
     * @param payload - The data for creating a new referral invite.
     * 
     * @returns A Promise that resolves to the created referral invite record.
     * @throws Will throw an error if the creation fails.
     */
    async createReferProgramInvite(payload: referProgramInviteInput): Promise<referProgramInviteOuput | any> {
        try {

            payload.referral_id = await service.otpGenerate.referalCodeGenerate();

            let response = await referProgramInviteModel.create(payload);

            return response;
        } catch (error) {
            console.log(error);
        }

    }

    /**
     * Retrieve all referral programs with their associated invites.
     * 
     * @returns A Promise that resolves to a list of referral programs with their invites.
     * @throws Will throw an error if the retrieval fails.
     */
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

    /**
     * Retrieve a paginated list of referral programs with their associated invites.
     * 
     * @param offset - The number of records to skip.
     * @param limit - The number of records to return.
     * 
     * @returns A Promise that resolves to a list of referral programs with their invites.
     * @throws Will throw an error if the retrieval fails.
     */
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


 
    /**
     * Retrieve all active referral programs with their associated invites.
     * 
     * @returns A Promise that resolves to a list of active referral programs with their invites.
     * @throws Will throw an error if the retrieval fails.
     */
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


    /**
     * Retrieve a specific referral program by its name.
     * 
     * @param payload - The name of the referral program to retrieve.
     * 
     * @returns A Promise that resolves to the referral program details with its invites.
     * @throws Will throw an error if the retrieval fails.
     */
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
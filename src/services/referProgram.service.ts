import referProgramModel, { referProgramInput, referProgramOuput } from '../models/model/refer_program.model';
import referProgramDal from "../models/dal/referProgram.dal";

import { referProgramInviteInput, referProgramInviteOuput } from '../models/model/refer_program_invite.model';
import { updateReferProgramStatus } from '../utils/interface';

class referProgramService {
    /**
     * 
     * @param payload 
     * @returns 
     */
    async create(payload: referProgramInput): Promise<referProgramOuput | any> {
        return await referProgramDal.createReferProgram(payload);
    }

    async editProgram(payload: referProgramInput): Promise<referProgramOuput | any> {
        return await referProgramDal.editReferProgram(payload);
    }

    async changeStatus(payload: updateReferProgramStatus): Promise<referProgramOuput | any> {
        return await referProgramDal.changeStatus(payload);
    }

    async createInvite(payload: referProgramInviteInput): Promise<referProgramInviteOuput | any> {
        return await referProgramDal.createReferProgramInvite(payload);
    }

    async getAllProgram(): Promise<referProgramOuput | any> {
        return await referProgramDal.getAllProgram();
    }

    async getProgramByLimit(offset: any, limit: any): Promise<referProgramOuput | any> {
        return await referProgramDal.getProgramByLimit(offset, limit);
    }


    async getActiveProgramEvent(): Promise<referProgramOuput | any> {
        return await referProgramDal.getAllProgramEvent();
    }

    async getSingleEvent(payload:string):Promise<referProgramOuput | any>{
        return await referProgramDal.getSingleEvent(payload);
    }
}

export default referProgramService;
import referProgramModel, { referProgramInput, referProgramOuput } from '../models/model/refer_program.model';
import referProgramDal from "../models/dal/referProgram.dal";

import { referProgramInviteInput, referProgramInviteOuput } from '../models/model/refer_program_invite.model';
import { updateReferProgramStatus } from '../utils/interface';

class referProgramService {

    /**
        * Creates a new referral program.
        * 
        * This method accepts a payload containing the details for creating a new referral program. It interacts with the 
        * database to persist the data and returns the created program's output.
        * 
        * @param {referProgramInput} payload - The details of the referral program to be created.
        * @returns {Promise<referProgramOuput>} The created referral program details.
        */
    async create(payload: referProgramInput): Promise<referProgramOuput | any> {
        return await referProgramDal.createReferProgram(payload);
    }

    /**
     * Edits an existing referral program.
     * 
     * This method accepts a payload with updated details for an existing referral program. It interacts with the database
     * to modify the existing program and returns the updated program details.
     * 
     * @param {referProgramInput} payload - The updated details of the referral program.
     * @returns {Promise<referProgramOuput>} The updated referral program details.
     */
    async editProgram(payload: referProgramInput): Promise<referProgramOuput | any> {
        return await referProgramDal.editReferProgram(payload);
    }

    /**
     * Changes the status of a referral program.
     * 
     * This method updates the status of a referral program based on the provided payload. The status update can be used 
     * to activate or deactivate referral programs, depending on the status field in the payload.
     * 
     * @param {updateReferProgramStatus} payload - The status update details for the referral program.
     * @returns {Promise<referProgramOuput>} The result of the status change operation.
     */
    async changeStatus(payload: updateReferProgramStatus): Promise<referProgramOuput | any> {
        return await referProgramDal.changeStatus(payload);
    }

    /**
    * Creates a referral invite for a specific program.
    * 
    * This method is used to create an invite for a referral program. The invite includes details like the referrer, the 
    * invitee, and other relevant information that helps track the referral process.
    * 
    * @param {referProgramInviteInput} payload - The details of the referral invite to be created.
    * @returns {Promise<referProgramInviteOuput>} The created referral invite details.
    */
    async createInvite(payload: referProgramInviteInput): Promise<referProgramInviteOuput | any> {
        return await referProgramDal.createReferProgramInvite(payload);
    }

    /**
   * Retrieves all available referral programs.
   * 
   * This method fetches all the referral programs present in the database. It returns the details of each program,
   * regardless of their status (active or inactive).
   * 
   * @returns {Promise<referProgramOuput | any>} A list of all referral programs.
   */
    async getAllProgram(): Promise<referProgramOuput | any> {
        return await referProgramDal.getAllProgram();
    }

    /**
     * Retrieves a limited list of referral programs based on pagination parameters.
     * 
     * This method fetches a list of referral programs from the database with the specified offset and limit values,
     * which can be used for pagination in UI displays.
     * 
     * @param {any} offset - The starting index for the list of referral programs to be fetched.
     * @param {any} limit - The maximum number of referral programs to retrieve.
     * @returns {Promise<referProgramOuput | any>} A list of referral programs within the specified limit.
     */
    async getProgramByLimit(offset: any, limit: any): Promise<referProgramOuput | any> {
        return await referProgramDal.getProgramByLimit(offset, limit);
    }

    /**
         * Retrieves all active referral program events.
         * 
         * This method returns all events associated with active referral programs. It can be used to display the currently
         * running referral events.
         * 
         * @returns {Promise<referProgramOuput | any>} A list of all active referral program events.
         */
    async getActiveProgramEvent(): Promise<referProgramOuput | any> {
        return await referProgramDal.getAllProgramEvent();
    }

    /**
     * Retrieves a specific referral program event by its ID.
     * 
     * This method fetches the details of a specific referral program event based on its ID. It is useful for fetching
     * details about a particular event, such as its status, requirements, and any rewards associated with it.
     * 
     * @param {string} payload - The ID of the referral program event to be fetched.
     * @returns {Promise<referProgramOuput | any>} The details of the specific referral program event.
     */
    async getSingleEvent(payload: string): Promise<referProgramOuput | any> {
        return await referProgramDal.getSingleEvent(payload);
    }
}

export default referProgramService;
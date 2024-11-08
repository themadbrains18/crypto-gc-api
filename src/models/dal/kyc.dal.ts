import kycModel, { kycInput, kycOuput } from "../model/kyc.model";
import { Sequelize, Op } from "sequelize";
import kycDto from "../dto/kyc.dto";
import { Direction } from "../../utils/interface";
import userModel from "../model/users.model";

class kycDal {

    /**
     * Returns all KYC data based on the type for the admin dashboard.
     * 
     * @param type - The type of KYC data to fetch (all, pending, approved, rejected).
     * @returns A Promise containing an array of KYC records.
     */
    async all(type: any): Promise<any> {
        if (type === Direction.All || type === Direction.Blank) {
            return await kycModel.findAll({ raw: true });
        }
        if (type === Direction.Pending || type === Direction.Approved) {
            return await kycModel.findAll({ where: { isVerified: type === Direction.Pending ? false : true, isReject: false } });
        }
        if (type === Direction.Rejected) {
            return await kycModel.findAll({ where: { isReject: true } });
        }
    }

    /**
     * Returns KYC data with pagination based on the type.
     * 
     * @param type - The type of KYC data to fetch (all, pending, approved, rejected).
     * @param offset - The number of records to skip for pagination.
     * @param limit - The number of records to return per page.
     * @returns A Promise containing the paginated list of KYC records.
     */
    async allByLimit(type: any, offset: any, limit: any): Promise<any> {
        let offsets = parseInt(offset);
        let limits = parseInt(limit);
        if (type === Direction.All || type === Direction.Blank) {
            return await kycModel.findAll({
                raw: true,
                limit: limits,
                offset: offsets
            });
        }
        if (type === Direction.Pending || type === Direction.Approved) {
            return await kycModel.findAll({ where: { isVerified: type === Direction.Pending ? false : true, isReject: false } });
        }
        if (type === Direction.Rejected) {
            return await kycModel.findAll({ where: { isReject: true } });
        }
    }


    /**
     * Fetches KYC data by user ID.
     * 
     * @param user_id - The user ID to fetch the KYC data for.
     * @returns A Promise containing the KYC record or null if not found.
     */
    async kycById(user_id: any): Promise<kycOuput | any> {
        return await kycModel.findOne({ where: { userid: user_id }, raw: true });
    }

    /**
     * Checks if KYC data already exists for a user.
     * 
     * @param payload - The KYC data to check for existence.
     * @returns A Promise containing the existing KYC record or an empty array if not found.
     */
    async kycIfExist(payload: kycDto): Promise<kycOuput | any> {

        // console.log(payload?.userid,'-----------------payload?.userid');
        
        if (payload?.userid != undefined && payload?.userid != "") {
            let data = await kycModel.findOne({
                where: {
                    "userid": payload?.userid
                }, raw: true
            });
            return data
        }

        return []

    }


    /**
     * Creates new KYC data for a user.
     * 
     * @param payload - The KYC data to create.
     * @returns A Promise containing the newly created KYC record.
     */

    async createKyc(payload: kycDto): Promise<kycOuput | any> {
        return await kycModel.create(payload);
    }

    /**
     * Edits an existing KYC record.
     * 
     * @param payload - The updated KYC data.
     * @returns A Promise containing the updated KYC record.
     */
    async editKyc(payload: kycDto): Promise<kycOuput | any> {

        let result = await kycModel.update(payload, { where: { userid: payload?.userid } });
        if (result.length > 0) {
            return await this.kycById(payload.userid);
        }
    }

    /**
     * Updates the KYC status (approved/rejected) for a user.
     * 
     * @param payload - The KYC data containing the status updates.
     * @returns A Promise containing the updated KYC record.
     */
    async updateKycStatus(payload: kycDto): Promise<kycOuput | any> {

        let result = await kycModel.update({ isVerified: payload.isVerified, isReject: payload.isReject }, { where: { userid: payload.userid } });

        if (result.length > 0) {
            if (payload.isVerified === true) {
                await userModel.update({ kycstatus: 'approve' }, { where: { id: payload.userid } });
            }
            if (payload.isReject === true) {
                await userModel.update({ kycstatus: 'reject' }, { where: { id: payload.userid } });
            }
            return await this.kycById(payload.userid);
        }
    }
}

export default new kycDal();

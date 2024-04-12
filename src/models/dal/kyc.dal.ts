import kycModel, { kycInput, kycOuput } from "../model/kyc.model";
import { Sequelize, Op } from "sequelize";
import kycDto from "../dto/kyc.dto";
import { Direction } from "../../utils/interface";
import userModel from "../model/users.model";

class kycDal {
    /**
     * return all KYC data for admin dashboard
     * @returns
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
     * get kyc data by id
     * @param user_id 
     * @returns 
     */
    async kycById(user_id: any): Promise<kycOuput | any> {
        return await kycModel.findOne({ where: { userid: user_id }, raw: true });
    }

    /**
   * check exissting kyc of user
   * @param payload
   * @returns 
   */
    async kycIfExist(payload: kycDto): Promise<kycOuput | any> {

        console.log(payload?.userid,'-----------------payload?.userid');
        
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
     * create new kyc
     * @param payload
     * @returns
     */

    async createKyc(payload: kycDto): Promise<kycOuput | any> {
        return await kycModel.create(payload);
    }

    async editKyc(payload: kycDto): Promise<kycOuput | any> {

        let result = await kycModel.update(payload, { where: { userid: payload?.userid } });
        if (result.length > 0) {
            return await this.kycById(payload.userid);
        }
    }

    /**
     * update kyc status by admin
     * @param payload
     * @returns 
     */
    async updateKycStatus(payload: kycDto): Promise<kycOuput | any> {

        let result = await kycModel.update({ isVerified: payload.isVerified, isReject: payload.isReject }, { where: { userid: payload.userid } });

        if (result.length > 0) {
            if (payload.isVerified === true) {
                await userModel.update({ kycstatus: 'approve' }, { where: { id: payload.userid } });
            }
            return await this.kycById(payload.userid);
        }
    }
}

export default new kycDal();

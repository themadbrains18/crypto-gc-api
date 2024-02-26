import { updateSiteDownStatus } from "../../utils/interface";
import siteMaintenanceDto from "../dto/sitemaintenance.dto";
import siteMaintenanceModel,{ siteMaintenanceOuput } from "../model/sitemaintenace.model";

class siteMaintenanceDal {

  /**
   * return all tokens data
   * @returns
   */
  async all(): Promise<any> {
    try {
      let trades = await siteMaintenanceModel.findAll({ raw: true });
      return trades;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  

  /**
   * create new token
   * @param payload
   * @returns
   */

  async createSiteMaintenance(payload: siteMaintenanceDto): Promise<siteMaintenanceOuput | any> {
    try {
      return await siteMaintenanceModel.create(payload);
    } catch (error) {
      console.log(error)
    }
  }

  async editSiteMaintenance(payload: siteMaintenanceDto): Promise<siteMaintenanceOuput | any> {
    try {

      return await siteMaintenanceModel.update(payload, { where: { id: payload.id } });

    } catch (error) {
      console.log(error)
    }
  }


  async changeStatus(payload: updateSiteDownStatus): Promise<any> {
    try {
      let pair: any = await siteMaintenanceModel.findOne({ where: { id: payload?.id }, raw :true });
      let apiStatus;
      apiStatus = await siteMaintenanceModel.update({ down_status: pair?.down_status == true ? false : true },{where: { id: payload?.id }});
      return apiStatus;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new siteMaintenanceDal();

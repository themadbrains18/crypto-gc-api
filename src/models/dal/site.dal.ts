import { updateSiteDownStatus } from "../../utils/interface";
import siteMaintenanceDto from "../dto/sitemaintenance.dto";
import siteMaintenanceModel, { siteMaintenanceOuput } from "../model/sitemaintenace.model";

class siteMaintenanceDal {


  /**
   * Retrieves all site maintenance data.
   * 
   * This method fetches all the site maintenance records from the database.
   * 
   * @returns {Promise<any>} A promise that resolves to the list of site maintenance records or throws an error if the retrieval fails.
   * @throws {Error} Throws an error if the retrieval fails.
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
   * Creates a new site maintenance record.
   * 
   * This method creates a new site maintenance record using the provided payload.
   * 
   * @param {siteMaintenanceDto} payload - The data transfer object containing details for creating a new site maintenance record.
   * @returns {Promise<siteMaintenanceOuput | any>} A promise that resolves to the newly created site maintenance record or an error object if creation fails.
   * @throws {Error} Throws an error if the creation fails.
   */
  async createSiteMaintenance(payload: siteMaintenanceDto): Promise<siteMaintenanceOuput | any> {
    try {
      return await siteMaintenanceModel.create(payload);
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Edits an existing site maintenance record.
   * 
   * This method updates an existing site maintenance record with the provided payload.
   * 
   * @param {siteMaintenanceDto} payload - The data transfer object containing the updated details for an existing site maintenance record.
   * @returns {Promise<siteMaintenanceOuput | any>} A promise that resolves to the updated site maintenance record or an error object if the update fails.
   * @throws {Error} Throws an error if the update fails.
   */
  async editSiteMaintenance(payload: siteMaintenanceDto): Promise<siteMaintenanceOuput | any> {
    try {

      return await siteMaintenanceModel.update(payload, { where: { id: payload.id } });

    } catch (error) {
      console.log(error)
    }
  }


  /**
   * Changes the status of the site (down or up).
   * 
   * This method toggles the `down_status` of the site maintenance record, changing it from `true` (down) to `false` (up) or vice versa.
   * 
   * @param {updateSiteDownStatus} payload - The object containing the ID of the site maintenance record and the desired action to toggle the status.
   * @returns {Promise<any>} A promise that resolves to the status update result or an error object if the operation fails.
   * @throws {Error} Throws an error if the status change fails.
   */
  async changeStatus(payload: updateSiteDownStatus): Promise<any> {
    try {
      let pair: any = await siteMaintenanceModel.findOne({ where: { id: payload?.id }, raw: true });
      let apiStatus;
      apiStatus = await siteMaintenanceModel.update({ down_status: pair?.down_status == true ? false : true }, { where: { id: payload?.id } });
      return apiStatus;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new siteMaintenanceDal();

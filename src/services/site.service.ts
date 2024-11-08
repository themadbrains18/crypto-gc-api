import { siteMaintenanceModel } from "../models";
import siteMaintenanceDal from "../models/dal/site.dal";
import siteMaintenanceDto from "../models/dto/sitemaintenance.dto";
import { updateSiteDownStatus } from "../utils/interface";

class siteMaintenanceServices {

  /**
     * Retrieves all site maintenance records.
     * 
     * This method fetches all the site maintenance records that are stored in the database.
     * 
     * @returns {Promise<any>} A promise that resolves to a list of all site maintenance records.
     */
    async all(): Promise<any> {
        return await siteMaintenanceDal.all();
    }
    
     /**
     * Creates a new site maintenance record.
     * 
     * This method takes the necessary details to create a new site maintenance record and stores it in the database.
     * 
     * @param {siteMaintenanceDto} payload The data required to create the new site maintenance record.
     * @returns {Promise<any>} A promise that resolves to the created site maintenance record or an error.
     */
    async create(payload : siteMaintenanceDto): Promise<any> {
        return await siteMaintenanceDal.createSiteMaintenance(payload);
    }

       /**
     * Checks if a site maintenance record with the given ID already exists.
     * 
     * This method queries the database to check if a site maintenance record with the specified ID is present.
     * 
     * @param {string} id The ID of the site maintenance record to check.
     * @returns {Promise<any>} A promise that resolves to the found record or `null` if no record is found.
     */
    async checkExist(id : string): Promise<any>{
        return await siteMaintenanceModel.findOne({where : {id : id}, raw : true});
    }
    
     /**
     * Edits an existing site maintenance record.
     * 
     * This method allows modification of an existing site maintenance record. The new data from the `payload` will replace the old data.
     * 
     * @param {siteMaintenanceDto} payload The updated data for the site maintenance record.
     * @returns {Promise<any>} A promise that resolves to the updated site maintenance record or an error.
     */
    async edit(payload : siteMaintenanceDto): Promise<any> {
        return await siteMaintenanceDal.editSiteMaintenance(payload);
    }


    /**
     * Updates the site status to indicate whether it is in maintenance mode.
     * 
     * This method is used to change the status of the site, either enabling or disabling the maintenance mode.
     * 
     * @param {updateSiteDownStatus} payload The new status to set for the site (either up or down).
     * @returns {Promise<any>} A promise that resolves to the updated site status or an error.
     */
    async updateStatus(payload : updateSiteDownStatus): Promise<any> {
        return await siteMaintenanceDal.changeStatus(payload);
    }
}

export default siteMaintenanceServices;


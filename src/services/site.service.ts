import { siteMaintenanceModel } from "../models";
import siteMaintenanceDal from "../models/dal/site.dal";
import siteMaintenanceDto from "../models/dto/sitemaintenance.dto";
import { updateSiteDownStatus } from "../utils/interface";

class siteMaintenanceServices {

    /**
     * 
     * @returns return all published token 
     */
    async all(): Promise<any> {
        return await siteMaintenanceDal.all();
    }
    
    async create(payload : siteMaintenanceDto): Promise<any> {
        return await siteMaintenanceDal.createSiteMaintenance(payload);
    }

    async checkExist(id : string): Promise<any>{
        return await siteMaintenanceModel.findOne({where : {id : id}, raw : true});
    }
    
    async edit(payload : siteMaintenanceDto): Promise<any> {
        return await siteMaintenanceDal.editSiteMaintenance(payload);
    }

    async updateStatus(payload : updateSiteDownStatus): Promise<any> {
        return await siteMaintenanceDal.changeStatus(payload);
    }
}

export default siteMaintenanceServices;


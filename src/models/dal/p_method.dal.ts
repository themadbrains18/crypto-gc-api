import { CustomError } from "../../exceptions/http-exception";
import paymentMethodDto from "../dto/p_method.dto";
import paymentMethodModel, { paymentOuput } from "../model/p_method.model";

class paymentMethodDal{

    /**
     * Add new payment method from admin dashboard
     * @param payload 
     * @returns 
     */
    async create(payload : paymentMethodDto): Promise<paymentOuput | any>{

        
        return await paymentMethodModel.create(payload);
    }

    async getPaymentList():Promise<paymentOuput | any>{
        console.log('---------herer payment list');
        
        return await paymentMethodModel.findAll(); 
    }

    async getPaymentListById(payload : string):Promise<paymentOuput | any>{
        return await paymentMethodModel.findOne({where :{id : payload}}); 
    }
    async updateMethodById(payload :paymentMethodDto ):Promise<paymentOuput | any>{
        let method= await paymentMethodModel.findOne({where :{id : payload.id}}); 
        if(method){
            return await paymentMethodModel.update(payload, { where: { id: payload.id } });
        }
    }
}

export default new paymentMethodDal();
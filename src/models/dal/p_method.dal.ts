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

        let p_method = paymentMethodModel.findAll({where : {payment_method : payload.payment_method}});

        if((await p_method).length >0){
            return {status : 500, message : "This Method is already exist!!."}  
        }
        return await paymentMethodModel.create(payload);
    }

    async getPaymentList():Promise<paymentOuput | any>{
        return await paymentMethodModel.findAll(); 
    }

    async getPaymentListById(payload : string):Promise<paymentOuput | any>{
        return await paymentMethodModel.findOne({where :{id : payload}}); 
    }
}

export default new paymentMethodDal();
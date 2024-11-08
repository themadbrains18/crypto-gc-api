import { CustomError } from "../../exceptions/http-exception";
import paymentMethodDto from "../dto/p_method.dto";
import paymentMethodModel, { paymentOuput } from "../model/p_method.model";

class paymentMethodDal{

    /**
     * Add a new payment method.
     * 
     * This method allows the admin to add a new payment method to the system.
     * 
     * @param payload - The payment method details to be added.
     * 
     * @returns A Promise that resolves to the created payment method.
     * @throws Will throw an error if the creation fails.
     */
    async create(payload : paymentMethodDto): Promise<paymentOuput | any>{

        
        return await paymentMethodModel.create(payload);
    }

    /**
     * Retrieve a list of all payment methods.
     * 
     * This method fetches all payment methods from the system.
     * 
     * @returns A Promise that resolves to an array of payment methods.
     * @throws Will throw an error if the retrieval fails.
     */
    async getPaymentList():Promise<paymentOuput | any>{
        return await paymentMethodModel.findAll(); 
    }

    /**
     * Retrieve a specific payment method by its ID.
     * 
     * This method fetches a payment method based on the provided ID.
     * 
     * @param payload - The ID of the payment method to retrieve.
     * 
     * @returns A Promise that resolves to the payment method matching the provided ID.
     * @throws Will throw an error if the retrieval fails.
     */
    async getPaymentListById(payload : string):Promise<paymentOuput | any>{
        return await paymentMethodModel.findOne({where :{id : payload}}); 
    }

    /**
     * Update a payment method by its ID.
     * 
     * This method allows updating the details of an existing payment method based on the provided ID.
     * 
     * @param payload - The payment method details to be updated.
     * 
     * @returns A Promise that resolves to the updated payment method.
     * @throws Will throw an error if the update fails.
     */
    async updateMethodById(payload :paymentMethodDto ):Promise<paymentOuput | any>{
        let method= await paymentMethodModel.findOne({where :{id : payload.id}}); 
        if(method){
            return await paymentMethodModel.update(payload, { where: { id: payload.id } });
        }
    }
}

export default new paymentMethodDal();
import paymentMethodDal from "../models/dal/p_method.dal";
import userPaymentMethodDal from "../models/dal/user_p_method.dal";
import paymentMethodDto from "../models/dto/p_method.dto";
import userPaymentMethodDto from "../models/dto/user_p_method.dto";
import { paymentOuput } from "../models/model/p_method.model";
import { userPmethodOuput } from "../models/model/user_p_method";
import service from "./service";

class paymentMethodService{

    /**
     * Add new payment method from admin dashboard
     * @param payload 
     * @returns 
     */
    async create(payload:paymentMethodDto):Promise<paymentOuput|any>{
        return await paymentMethodDal.create(payload);
    }
    /**
     * Retrieves the list of all available payment methods.
     * 
     * This method fetches all payment methods available in the system and returns them as a list.
     * 
     * @returns {Promise<paymentOuput | any>} A list of payment methods or any error.
     */
    async getMethodList():Promise<paymentOuput | any>{
        return await paymentMethodDal.getPaymentList();
    }

      /**
     * Retrieves the details of a specific payment method by its ID.
     * 
     * This method fetches a payment method based on the provided ID.
     * 
     * @param {string} payload - The ID of the payment method to retrieve.
     * @returns {Promise<paymentOuput | any>} The details of the payment method or any error.
     */
    async getPaymentMethodById(payload : string) : Promise<paymentOuput | any>{
        return await paymentMethodDal.getPaymentListById(payload);
    }

    /**
     * Updates an existing payment method by its ID.
     * 
     * This method allows updating the details of a payment method based on the provided ID and new data in the payload.
     * 
     * @param {paymentMethodDto} payload - The updated payment method details.
     * @returns {Promise<paymentOuput | any>} The updated payment method details or any error.
     */
    async updatePaymentMethodById(payload : paymentMethodDto) : Promise<paymentOuput | any>{
        return await paymentMethodDal.updateMethodById(payload);
    }
    /**
     * Creates a user-specific payment method.
     * 
     * This method allows creating a new user payment method by associating the payment method with a specific user.
     * 
     * @param {userPaymentMethodDto} payload - The details of the user payment method to be added.
     * @returns {Promise<userPmethodOuput | any>} The created user payment method details or any error.
     */
    async createUserPaymentMethod(payload : userPaymentMethodDto): Promise<userPmethodOuput | any>{
        return await userPaymentMethodDal.create(payload);
    }
    /**
     * Retrieves the user payment method by user ID.
     * 
     * This method fetches the payment method associated with a specific user.
     * 
     * @param {string} payload - The user ID to retrieve the payment method for.
     * @returns {Promise<userPmethodOuput | any>} The user's payment method details or any error.
     */
    async getUserMethod(payload:string) :Promise<userPmethodOuput | any>{
        return await userPaymentMethodDal.getUserMethod(payload);
    }

      /**
     * Removes a user payment method by its ID.
     * 
     * This method removes the user payment method from the database based on the provided ID.
     * 
     * @param {string} payload - The ID of the user payment method to be removed.
     * @returns {Promise<userPmethodOuput | any>} The removed user payment method details or any error.
     */

    async removeUserMethodById(payload :string) : Promise<userPmethodOuput | any>{
        return await userPaymentMethodDal.removeUserMethodById(payload);
    }
}

export default paymentMethodService;
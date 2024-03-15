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

    async getMethodList():Promise<paymentOuput | any>{
        return await paymentMethodDal.getPaymentList();
    }

    async getPaymentMethodById(payload : string) : Promise<paymentOuput | any>{
        return await paymentMethodDal.getPaymentListById(payload);
    }
    async updatePaymentMethodById(payload : paymentMethodDto) : Promise<paymentOuput | any>{
        return await paymentMethodDal.updateMethodById(payload);
    }

    async createUserPaymentMethod(payload : userPaymentMethodDto): Promise<userPmethodOuput | any>{
        return await userPaymentMethodDal.create(payload);
    }

    async getUserMethod(payload:string) :Promise<userPmethodOuput | any>{
        return await userPaymentMethodDal.getUserMethod(payload);
    }

    async removeUserMethodById(payload :string) : Promise<userPmethodOuput | any>{
        return await userPaymentMethodDal.removeUserMethodById(payload);
    }
}

export default paymentMethodService;
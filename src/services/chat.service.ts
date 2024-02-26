import P2PchatDal from "../models/dal/chat.dal";
import { P2PchatDto } from "../models/dto/chat.dto";
import { chatOuput } from "../models/model/chat.model";

class chatService{

    /**
     * 
     * @param payload 
     * @returns 
     */
    async create(payload:P2PchatDto):Promise<chatOuput | any>{
        return await P2PchatDal.create(payload);
    }

    /**
     * Get chat by order id
     * @param orderid 
     * @returns 
     */
    async chatList(orderid:string):Promise<chatOuput | any >{
        return await P2PchatDal.chatListByOrderId(orderid);
    }

}

export default chatService;
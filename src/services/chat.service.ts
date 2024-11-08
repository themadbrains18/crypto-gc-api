import P2PchatDal from "../models/dal/chat.dal";
import { P2PchatDto } from "../models/dto/chat.dto";
import { chatOuput } from "../models/model/chat.model";

class chatService{

  /**
   * Creates a new chat message.
   * 
   * @param {P2PchatDto} payload - The data transfer object containing the chat message details.
   * @returns {Promise<chatOuput | any>} - Returns a promise that resolves to the created chat message or an error.
   */
    async create(payload:P2PchatDto):Promise<chatOuput | any>{
        return await P2PchatDal.create(payload);
    }
  /**
   * Retrieves a list of chat messages for a specific order ID.
   * 
   * @param {string} orderid - The order ID for which to fetch the chat messages.
   * @returns {Promise<chatOuput | any>} - Returns a promise resolving to an array of chat messages for the specified order.
   */
    async chatList(orderid:string):Promise<chatOuput | any >{
        return await P2PchatDal.chatListByOrderId(orderid);
    }

}

export default chatService;
import { P2PchatDto } from "../dto/chat.dto";
import chatModel, { chatOuput } from "../model/chat.model";

class P2PchatDal {


    /**
     * Create a new chat message or append to an existing chat thread.
     * 
     * @param payload - The P2PchatDto containing chat details.
     * @returns The updated chat object after creation or update.
     */
    async create(payload: P2PchatDto): Promise<chatOuput | any> {
        try {
            let chat = [];
            let obj = {};

            const date= new Date();

            if (payload.chat !== '') {

                obj = { from : payload.from, to : payload.to, message:payload.chat,  createdAt:date};
                chat.push(obj);
            }
            else {
                throw new Error('Message should not be blank or empty');
            }

            let oldChat = await chatModel.findOne({where : {orderid : payload.orderid}});
            let previousChat:any = oldChat?.dataValues;
            if(previousChat){
                let oldMessage = previousChat.chat;
                const newArray = oldMessage.concat(chat);
                await chatModel.update({chat : newArray},{where : {id : previousChat.id}});
                previousChat.chat = newArray;
                return previousChat;
            }
            else{
                let createObj:any = { post_id : payload.post_id, buy_user_id : payload.buy_user_id, sell_user_id:payload.sell_user_id, orderid:payload.orderid, chat };
                return await chatModel.create(createObj);
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    
    /**
     * Fetch chat messages for a specific order ID.
     * 
     * @param orderid - The order ID for which chat messages are fetched.
     * @returns A list of chat messages for the specified order ID.
     */
    async chatListByOrderId(orderid : string):Promise<chatOuput | any>{
        try {
            return await chatModel.findAll({where : {orderid : orderid}});
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
}

export default new P2PchatDal()
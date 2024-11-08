/**
 * Data Transfer Object (DTO) for Peer-to-Peer (P2P) chat messages.
 * 
 * This interface defines the structure for chat messages exchanged between users during a P2P transaction.
 * It includes properties related to the post, the users involved, and the chat content.
 * 
 * @interface P2PchatDto
 * 
 * @property {string} [post_id] - The unique identifier of the post associated with the chat. Optional.
 * @property {string} [sell_user_id] - The user ID of the seller in the P2P transaction. Optional.
 * @property {string} [buy_user_id] - The user ID of the buyer in the P2P transaction. Optional.
 * @property {string} [from] - The user sending the chat message. Optional.
 * @property {string} [to] - The user receiving the chat message. Optional.
 * @property {string} [orderid] - The unique identifier of the order related to the chat message. Optional.
 * @property {string} [chat] - The content of the chat message. Optional.
 */
export interface P2PchatDto {
    post_id?: string;
    sell_user_id?: string;
    buy_user_id?: string;
    from?: string;
    to?: string;
    orderid?: string;
    chat?: string;
}

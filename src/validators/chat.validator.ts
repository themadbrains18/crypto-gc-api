import Joi from "joi";

/**
 * Validation schema for chat-related operations.
 * @typedef {Object} chatSchema
 */
const chatSchema = {

  /**
   * Schema for creating a new chat entry.
   * @property {string} post_id - Required. The ID of the post associated with the chat.
   * @property {string} sell_user_id - Required. The ID of the selling user.
   * @property {string} buy_user_id - Required. The ID of the buying user.
   * @property {string} from - Required. The source or sender of the chat message.
   * @property {string} to - Required. The destination or recipient of the chat message.
   * @property {string} orderid - Required. The ID of the order associated with the chat.
   * @property {string} chat - Required. The content of the chat message.
   */
  create: Joi.object().keys({
    post_id: Joi.string().required(),
    sell_user_id: Joi.string().required(),
    buy_user_id: Joi.string().required(),
    from: Joi.string().required(),
    to: Joi.string().required(),
    orderid: Joi.string().required(),
    chat: Joi.string().required()
  })
}

export default chatSchema;

import Joi from "joi";

/**
 * Validation schemas for P2P order-related operations.
 * @typedef {Object} p2pOrderSchema
 */
const p2pOrderSchema = {

  /**
   * Schema for creating a new P2P order.
   * @property {string} post_id - Required. The ID of the post that the order is linked to.
   * @property {string} sell_user_id - Required. The user ID of the seller.
   * @property {string} buy_user_id - Required. The user ID of the buyer.
   * @property {string} token_id - Required. The ID of the token being traded.
   * @property {number} price - Required. The price per token in the order. Must be a positive number.
   * @property {number} quantity - Required. The quantity of tokens being traded. Must be a positive number.
   * @property {number} spend_amount - Required. The total amount the buyer spends. Must be a positive number.
   * @property {number} receive_amount - Required. The total amount the seller receives. Must be a positive number.
   * @property {string} spend_currency - Required. The currency being spent (e.g., 'USDT').
   * @property {string} receive_currency - Required. The currency being received (e.g., 'BTC').
   * @property {string} [p_method] - Optional. The payment method used for the transaction.
   * @property {string} status - Required. The status of the order (e.g., 'pending', 'completed').
   * @property {string} type - Required. The type of the order (e.g., 'buy', 'sell').
   */
  create: Joi.object().keys({
    post_id: Joi.string().required(),
    sell_user_id: Joi.string().required(),
    buy_user_id: Joi.string().required(),
    token_id: Joi.string().required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().positive().required(),
    spend_amount: Joi.number().positive().required(),
    receive_amount: Joi.number().positive().required(),
    spend_currency: Joi.string().required(),
    receive_currency: Joi.string().required(),
    p_method: Joi.string().optional().allow(''),
    status: Joi.string().required(),
    type: Joi.string().required(),
  }),

  /**
   * Schema for cancelling a P2P order.
   * @property {string} order_id - Required. The ID of the order to be cancelled.
   * @property {string} user_id - Required. The user ID requesting the cancellation.
   * @property {string} cancelType - Required. The type of cancellation (e.g., 'user_request', 'timeout').
   */
  cancel: Joi.object().keys({
    order_id: Joi.string().required(),
    user_id: Joi.string().required(),
    cancelType: Joi.string().required(),
  }),

  /**
   * Schema for updating a P2P order.
   * @property {string} order_id - Required. The ID of the order to be updated.
   */
  update: Joi.object().keys({
    order_id: Joi.string().required(),
  }),

  /**
   * Schema for releasing funds in a P2P order.
   * @property {string} order_id - Required. The ID of the order to release funds for.
   * @property {string} user_id - Required. The user ID performing the release.
   * @property {string} fundcode - Required. The unique fund code used to release funds.
   */
  release: Joi.object().keys({
    order_id: Joi.string().required(),
    user_id: Joi.string().required(),
    fundcode: Joi.string().required(),
  }),
};

export default p2pOrderSchema;

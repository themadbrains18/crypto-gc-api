import Joi from "joi";

/**
 * Validation schemas for ad posting operations.
 * @typedef {Object} adsPostSchema
 */
const adsPostSchema = {
  
  /**
   * Schema for creating a new ad post.
   * @property {string} user_id - Required. The ID of the user creating the post.
   * @property {string} token_id - Required. The ID of the token associated with the post.
   * @property {number} price - Required. Positive number representing the price.
   * @property {number} quantity - Required. Positive number representing the quantity.
   * @property {number} min_limit - Required. Positive number representing the minimum limit.
   * @property {number} max_limit - Required. Positive number representing the maximum limit.
   * @property {Array<Object>} p_method - Required. Array of objects, each with `upm_id` as a string.
   * @property {string} payment_time - Required. The time allowed for payment.
   * @property {string} [remarks] - Optional. Remarks for the post.
   * @property {boolean} [complete_kyc] - Optional. Indicates if complete KYC is required.
   * @property {boolean} [min_btc] - Optional. Indicates if minimum BTC condition applies.
   * @property {boolean} [status] - Optional. Status of the post.
   * @property {string} [fundcode] - Optional. Fund code.
   * @property {string} [condition] - Optional. Additional conditions.
   * @property {string} [auto_reply] - Optional. Auto-reply message.
   * @property {string} [price_type] - Optional. Type of price.
   */
  create: Joi.object().keys({
    user_id: Joi.string().required(),
    token_id: Joi.string().required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().positive().required(),
    min_limit: Joi.number().positive().required(),
    max_limit: Joi.number().positive().required(),
    p_method: Joi.array().items({ "upm_id": Joi.string().required() }).required(),
    payment_time: Joi.string().required(),
    remarks: Joi.string().optional().allow(''),
    complete_kyc: Joi.boolean().optional().allow(''),
    min_btc: Joi.boolean().optional().allow(''),
    status: Joi.boolean().optional().allow(''),
    fundcode: Joi.string().optional().allow(''),
    condition: Joi.string().optional().allow(''),
    auto_reply: Joi.string().optional().allow(''),
    price_type: Joi.string().optional()
  }),

  /**
   * Schema for editing an existing ad post.
   * @property {string} id - Required. The ID of the post being edited.
   * @property {string} user_id - Required. The ID of the user editing the post.
   * @property {string} token_id - Required. The ID of the token associated with the post.
   * @property {number} price - Required. Positive number representing the price.
   * @property {number} quantity - Required. Positive number representing the quantity.
   * @property {number} min_limit - Required. Positive number representing the minimum limit.
   * @property {number} max_limit - Required. Positive number representing the maximum limit.
   * @property {Array<Object>} p_method - Required. Array of objects, each with `upm_id` as a string.
   * @property {string} payment_time - Required. The time allowed for payment.
   * @property {string} [remarks] - Optional. Remarks for the post.
   * @property {boolean} [complete_kyc] - Optional. Indicates if complete KYC is required.
   * @property {boolean} [min_btc] - Optional. Indicates if minimum BTC condition applies.
   * @property {boolean} [status] - Optional. Status of the post.
   * @property {string} [fundcode] - Optional. Fund code.
   * @property {string} [condition] - Optional. Additional conditions.
   * @property {string} [auto_reply] - Optional. Auto-reply message.
   * @property {string} [price_type] - Optional. Type of price.
   */
  edit: Joi.object().keys({
    id: Joi.string().required(),
    user_id: Joi.string().required(),
    token_id: Joi.string().required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().positive().required(),
    min_limit: Joi.number().positive().required(),
    max_limit: Joi.number().positive().required(),
    p_method: Joi.array().items({ "upm_id": Joi.string().required() }).required(),
    payment_time: Joi.string().required(),
    remarks: Joi.string().optional().allow(''),
    complete_kyc: Joi.boolean().optional().allow(''),
    min_btc: Joi.boolean().optional().allow(''),
    status: Joi.boolean().optional().allow(''),
    fundcode: Joi.string().optional().allow(''),
    condition: Joi.string().optional().allow(''),
    auto_reply: Joi.string().optional().allow(''),
    price_type: Joi.string().optional()
  }),

  /**
   * Schema for updating the status of an ad post.
   * @property {string} post_id - Required. The ID of the post.
   * @property {string} user_id - Required. The ID of the user associated with the post.
   */
  status: Joi.object().keys({
    post_id: Joi.string().required(),
    user_id: Joi.string().required()
  })
}

export default adsPostSchema;

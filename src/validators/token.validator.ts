//* validators/token.validator.js
// schemas.js
import Joi from "joi";

/**
 * Validation schemas for token-related operations.
 * @typedef {Object} tokenSchema
 */
const tokenSchema = {

  /**
   * Schema for creating a new token entry.
   * @property {string} symbol - Required. Uppercase token symbol (3-5 characters).
   * @property {string} fullName - Required. Full name of the token; allows alphanumerics, space, and commas (3-30 characters).
   * @property {number} minimum_withdraw - Required. Minimum withdrawal amount.
   * @property {number} decimals - Required. Positive number defining token decimals, must be between 5 and 20.
   * @property {string} tokenType - Required. Type of token (e.g., 'ERC20', 'BEP20').
   * @property {string} [image] - Optional. Image URL for the token.
   * @property {boolean} [status=false] - Optional. Token status (active/inactive), default is false.
   * @property {Array} networks - Required. Array of networks where the token is supported.
   *    - @property {string} id - Required. Network ID.
   *    - @property {number} fee - Required. Network fee, must be positive and greater than 0.001.
   *    - @property {number} [decimal] - Optional. Network-specific decimal setting, must be between 5 and 20.
   *    - @property {string} contract - Required. Contract address for the token on this network.
   * @property {number} price - Required. Token price, must be positive.
   * @property {number} min_price - Required. Minimum price, must be positive.
   * @property {number} max_price - Required. Maximum price, must be positive.
   * @property {string} type - Required. Type of the token (e.g., 'utility', 'security').
   * @property {number} [fees] - Optional. Any additional token fees.
   */
  create: Joi.object().keys({
    symbol: Joi.string().uppercase().min(3).max(5).required(),
    fullName: Joi.string()
      .regex(/^[a-zA-Z0-9, ]*$/, 'Alphanumerics, space and comma characters')
      .min(3)
      .max(30)
      .required(),
    minimum_withdraw: Joi.number().required(),
    decimals: Joi.number().positive().greater(5).less(20).required(),
    tokenType: Joi.string().required(),
    image: Joi.string().optional(),
    status: Joi.boolean().default(false),
    networks: Joi.array().items(
      Joi.object({
        "id": Joi.string().required(),
        "fee": Joi.number().positive().greater(0.001).required(),
        "decimal": Joi.number().positive().greater(5).less(20).optional(),
        "contract": Joi.string().required(),
      })
    ).required(),
    price: Joi.number().positive().greater(0).required(),
    min_price: Joi.number().positive().greater(0).required(),
    max_price: Joi.number().positive().greater(0).required(),
    type: Joi.string().required(),
    fees: Joi.number().optional(),
  }),

  /**
   * Schema for editing an existing token entry.
   * @property {string} id - Required. Unique identifier of the token to edit.
   * @property {string} symbol - Required. Uppercase token symbol (3-5 characters).
   * @property {string} fullName - Required. Full name of the token; allows alphanumerics, space, and commas (3-30 characters).
   * @property {number} minimum_withdraw - Required. Minimum withdrawal amount.
   * @property {number} decimals - Required. Positive number defining token decimals, must be between 5 and 20.
   * @property {string} tokenType - Required. Type of token (e.g., 'ERC20', 'BEP20').
   * @property {string} [image] - Optional. Image URL for the token.
   * @property {boolean} [status=false] - Optional. Token status (active/inactive), default is false.
   * @property {Array} networks - Required. Array of networks where the token is supported.
   *    - @property {string} id - Required. Network ID.
   *    - @property {number} fee - Required. Network fee, must be positive and greater than 0.001.
   *    - @property {number} [decimal] - Optional. Network-specific decimal setting, must be between 5 and 20.
   *    - @property {string} contract - Required. Contract address for the token on this network.
   * @property {number} price - Required. Token price, must be positive.
   * @property {number} min_price - Required. Minimum price, must be positive.
   * @property {number} max_price - Required. Maximum price, must be positive.
   * @property {string} type - Required. Type of the token (e.g., 'utility', 'security').
   */
  edit: Joi.object().keys({
    id: Joi.string().required(),
    symbol: Joi.string().uppercase().min(3).max(5).required(),
    fullName: Joi.string()
      .regex(/^[a-zA-Z0-9, ]*$/, 'Alphanumerics, space and comma characters')
      .min(3)
      .max(30)
      .required(),
    minimum_withdraw: Joi.number().required(),
    decimals: Joi.number().positive().greater(5).less(20).required(),
    tokenType: Joi.string().required(),
    image: Joi.string().allow(''),
    status: Joi.boolean().default(false),
    networks: Joi.array().items(
      Joi.object({
        "id": Joi.string().required(),
        "fee": Joi.number().positive().greater(0.001).required(),
        "decimal": Joi.number().positive().greater(5).less(20).optional(),
        "contract": Joi.string().required(),
      })
    ).required(),
    price: Joi.number().positive().greater(0).required(),
    min_price: Joi.number().positive().greater(0).required(),
    max_price: Joi.number().positive().greater(0).required(),
    type: Joi.string().required(),
  }),

  /**
   * Schema for listing specific tokens with pagination.
   * @property {number} page - Required. Current page number.
   * @property {number} pageSize - Required. Number of tokens per page.
   */
  blogLIST: {
    page: Joi.number().required(),
    pageSize: Joi.number().required(),
  },
};

export default tokenSchema;

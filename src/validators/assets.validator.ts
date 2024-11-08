import Joi from "joi";

/**
 * Validation schemas for asset-related operations.
 * @typedef {Object} assetSchema
 */
const assetSchema = {

  /**
   * Schema for creating a new asset.
   * @property {string} user_id - Required. The ID of the user associated with the asset.
   * @property {string} account_type - Required. The type of account for the asset.
   * @property {string} walletTtype - Required. The type of wallet for the asset.
   * @property {string} token_id - Required. The ID of the token associated with the asset.
   * @property {number} balance - Required. The balance amount for the asset.
   */
  create: Joi.object().keys({
    user_id: Joi.string().required(),
    account_type: Joi.string().required(),
    walletTtype: Joi.string().required(),
    token_id: Joi.string().required(),
    balance: Joi.number().required(),
  }),

  /**
   * Schema for transferring assets between wallets.
   * @property {string} user_id - Required. The ID of the user initiating the transfer.
   * @property {string} from - Required. The source wallet identifier.
   * @property {string} to - Required. The destination wallet identifier.
   * @property {string} token_id - Required. The ID of the token being transferred.
   * @property {number} balance - Required. Positive number representing the amount to be transferred.
   */
  walletTowallet: Joi.object().keys({
    user_id: Joi.string().required(),
    from: Joi.string().required(),
    to: Joi.string().required(),
    token_id: Joi.string().required(),
    balance: Joi.number().positive().required(),
  }),

}

export default assetSchema;

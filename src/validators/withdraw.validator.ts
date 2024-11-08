//* validators/withdraw.validator.js
// schemas.js
import Joi from "joi";

/**
 * Validation schema for withdrawal-related operations.
 * @typedef {Object} withdrawSchema
 */
const withdrawSchema = {

  /**
   * Schema for creating a new withdrawal request.
   * @property {string} symbol - Required. Symbol of the token being withdrawn, in uppercase (3 to 5 characters).
   * @property {string} tokenName - Required. Name of the token for the withdrawal request.
   * @property {string} tokenID - Required. Unique identifier of the token being withdrawn.
   * @property {string} withdraw_wallet - Required. Address of the wallet where funds will be withdrawn.
   * @property {number} amount - Required. Amount to be withdrawn, must be a positive number.
   * @property {string} status - Required. Status of the withdrawal request.
   * @property {string} user_id - Required. Unique identifier of the user requesting the withdrawal.
   * @property {string} [tx_hash] - Optional. Transaction hash for the withdrawal.
   * @property {string} [tx_type] - Optional. Type of the transaction (e.g., 'withdrawal').
   * @property {string} fee - Required. Fee applied to the withdrawal transaction.
   * @property {string} networkId - Required. Network ID of the blockchain for the withdrawal.
   * @property {string} type - Required. Type of the withdrawal (e.g., 'crypto').
   * @property {string} username - Required. Username of the user performing the withdrawal.
   * @property {string} otp - Required. OTP for withdrawal authorization.
   * @property {number} step - Required. Step in the withdrawal process.
   */
  create: Joi.object().keys({
    symbol: Joi.string().uppercase().min(3).max(5).required(),
    tokenName: Joi.string().required(),
    tokenID: Joi.string().required(),
    withdraw_wallet: Joi.string().required(),
    amount: Joi.number().positive().required(),
    status: Joi.string().required(),
    user_id: Joi.string().required(),
    tx_hash: Joi.string().optional(),
    tx_type: Joi.string().optional(),
    fee: Joi.string().required(),
    networkId: Joi.string().required(),
    type: Joi.string().required(),
    username: Joi.string().required(),
    otp: Joi.string().required(),
    step: Joi.number().required(),
  }),
};

export default withdrawSchema;

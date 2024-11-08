//* validators/user.validator.js
// schemas.js
import Joi from "joi";

/**
 * Validation schema for user account operations.
 * @typedef {Object} usersSchema
 */
const usersSchema = {

  /**
   * Schema for scanning a user's account on a specific blockchain.
   * @property {string} address - Required. The blockchain address of the user.
   * @property {number} chainid - Required. The chain ID representing the blockchain network.
   */
  userAccountScanner: Joi.object().keys({
    address: Joi.string().required(),
    chainid: Joi.number().required(),
  }),
  
};

export default usersSchema;

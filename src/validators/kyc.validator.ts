import Joi from "joi";
const now = Date.now();
const cutoffDate = new Date(now - (1000 * 60 * 60 * 24 * 365 * 18)); // go back by 21 years

/**
 * Validation schemas for KYC (Know Your Customer) operations.
 * @typedef {Object} kycSchema
 */
const kycSchema = {

  /**
   * Schema for creating a new KYC entry.
   * @property {string} user_id - Required. The unique identifier of the user.
   * @property {string} country - Required. The country of the user.
   * @property {string} fname - Required. The first name of the user.
   * @property {string} doctype - Required. The type of the document being provided.
   * @property {string} docnumber - Required. The document number, should be between 6 and 30 characters.
   * @property {Buffer} [idfront] - Optional. Front image of the document.
   * @property {Buffer} [idback] - Optional. Back image of the document.
   * @property {Buffer} [statement] - Optional. A supporting statement document.
   * @property {string} [destinationPath] - Optional. Path where the KYC documents are stored.
   * @property {Date} dob - Required. The date of birth of the user. Should be 18 years or older.
   */
  create: Joi.object().keys({
    user_id: Joi.string().min(3).max(500).required(),
    country: Joi.string().required(),
    fname: Joi.string().required(),
    doctype: Joi.string().required(),
    docnumber: Joi.string().required().min(6).max(30),
    idfront: Joi.binary().encoding('utf8').optional(),
    idback: Joi.binary().encoding('utf8').optional(),
    statement: Joi.binary().encoding('utf8').optional(),
    destinationPath: Joi.string().optional(),
    dob: Joi.date().max(cutoffDate).required(),
  }),

  /**
   * Schema for updating the status of KYC verification.
   * @property {string} userid - Required. The unique identifier of the user whose KYC status is being updated.
   * @property {boolean} [isVerified] - Optional. Indicates whether the user's KYC is verified.
   * @property {boolean} [isReject] - Optional. Indicates whether the user's KYC is rejected.
   * @property {string} [user_id] - Optional. An additional user ID, can be used for other user-related checks.
   */
  status: Joi.object().keys({
    userid: Joi.string().min(3).max(500).required(),
    isVerified: Joi.boolean().optional(),
    isReject: Joi.boolean().optional(),
    user_id: Joi.string().optional(),
  }),
};

export default kycSchema;

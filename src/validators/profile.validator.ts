import Joi from "joi";

/**
 * Validation schemas for profile-related operations.
 * @typedef {Object} profileSchema
 */
const profileSchema = {

  /**
   * Schema for creating a new user profile.
   * @property {string} fName - The first name of the user. Optional field that can be an empty string.
   * @property {string} lName - The last name of the user. Optional field that can be an empty string.
   * @property {string} dName - The display name of the user. Required field.
   * @property {string} uName - The unique username of the user. Required field.
   * @property {string} user_id - The unique ID of the user. Required field.
   */
  create: Joi.object().keys({
    fName: Joi.string().allow('').optional(),   // Optional first name (can be empty string)
    lName: Joi.string().allow('').optional(),   // Optional last name (can be empty string)
    dName: Joi.string().required(),             // Required display name
    uName: Joi.string().required(),             // Required unique username
    user_id: Joi.string().required()            // Required unique user ID
  }),
};

export default profileSchema;

import Joi from "joi";

/**
 * Validation schema for user registration.
 * @typedef {Object} registerSchema
 */
const registerSchema = Joi.object({

  /**
   * Schema for user registration entry.
   * @property {string} email - Required. The email address of the user. Must be a valid email format and lowercase.
   * @property {string} username - Required. The username of the user. Must be a non-empty string.
   *  @property {string} password - Required. The password for the user. Must be at least 4 characters long.
   * @property {string} name - Required. The first name of the user. Must be a non-empty string.
   * @property {string} surname - Required. The surname of the user. Must be a non-empty string.
   */
  email: Joi.string().email().lowercase().required(),

  username: Joi.string().min(1).required(),
  password: Joi.string().min(4).required(),
  name: Joi.string().min(1).required(),
  surname: Joi.string().min(1).required()

});

export default registerSchema;

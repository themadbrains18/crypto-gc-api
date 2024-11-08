import Joi from "joi";

/**
 * Validation schemas for user settings-related operations.
 * @typedef {Object} settingSchema
 */
const settingSchema = {

  /**
   * Schema for updating a fund code.
   * @property {string} user_id - Required. The ID of the user updating their fund code.
   * @property {string} [old_password] - Optional. The current fund code password (not required).
   * @property {string} new_password - Required. The new fund code password to be set.
   */
  updatefundcode: Joi.object().keys({
    user_id: Joi.string().required(),
    old_password: Joi.optional(),
    new_password: Joi.string().required()
  }),

  /**
   * Schema for updating the user password.
   * @property {string} user_id - Required. The ID of the user updating their password.
   * @property {string} old_password - Required. The user's current password.
   * @property {string} new_password - Required. The new password to be set.
   */
  updatepassword: Joi.object().keys({
    user_id: Joi.string().required(),
    old_password: Joi.string().required(),
    new_password: Joi.string().required()
  }),
};

export default settingSchema;

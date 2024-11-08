import Joi from "joi";

/**
 * Validation schemas for site maintenance-related operations.
 * @typedef {Object} siteMaintenanceSchema
 */
const siteMaintenanceSchema = {

  /**
   * Schema for creating a new maintenance message.
   * @property {string} user_id - Required. The ID of the user creating the maintenance message.
   * @property {string} title - Required. The title of the maintenance message.
   * @property {string} message - Required. The content of the maintenance message.
   */
  create: Joi.object().keys({
    user_id: Joi.string().required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
  }),

  /**
   * Schema for editing an existing maintenance message.
   * @property {string} user_id - Required. The ID of the user editing the maintenance message.
   * @property {string} id - Required. The unique identifier of the maintenance message to edit.
   * @property {string} title - Required. The updated title of the maintenance message.
   * @property {string} message - Required. The updated content of the maintenance message.
   */
  edit: Joi.object().keys({
    user_id: Joi.string().required(),
    id: Joi.string().required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
  }),
};

export default siteMaintenanceSchema;

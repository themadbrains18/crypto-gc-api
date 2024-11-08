import Joi from "joi";

/**
 * Validation schemas for payment method-related operations.
 * @typedef {Object} p_methodSchema
 */
const p_methodSchema = {

  /**
   * Schema for creating a new payment method.
   * @property {string} payment_method - Required. The name of the payment method (e.g., 'Credit Card', 'PayPal').
   * @property {string} [icon] - Optional. The icon associated with the payment method (e.g., URL or icon name).
   * @property {string} region - Required. The region where the payment method is applicable (e.g., 'US', 'EU').
   * @property {string} [user_id] - Optional. The unique identifier of the user associated with the payment method.
   * @property {Array<Object>} fields - Required. A list of fields associated with the payment method.
   * @property {string} fields.name - Required. The name of the field (e.g., 'card_number', 'expiry_date').
   * @property {string} fields.type - Required. The type of the field (e.g., 'text', 'number').
   * @property {string} [fields.label] - Optional. The label for the field (e.g., 'Card Number', 'Expiration Date').
   * @property {string} [fields.required] - Optional. Indicates if the field is required (e.g., 'true', 'false').
   * @property {string} [fields.ifoptional] - Optional. Condition to display this field if optional.
   * @property {string} [fields.placeholder] - Optional. Placeholder text for the field (e.g., 'Enter card number').
   * @property {string} [fields.err_msg] - Optional. Error message for the field validation.
   */
  create: Joi.object().keys({
    payment_method: Joi.string().required(),
    icon: Joi.string().optional(),
    region: Joi.string().required(),
    user_id: Joi.string().optional(),
    fields: Joi.array().items({
      name: Joi.string().required(),
      type: Joi.string().required(),
      label: Joi.string().optional(),
      required: Joi.string().optional(),
      ifoptional: Joi.string().optional(),
      placeholder: Joi.string().optional(),
      err_msg: Joi.string().optional(),
    }).required(),
  })
};

export default p_methodSchema;

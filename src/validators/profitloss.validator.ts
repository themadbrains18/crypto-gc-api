import Joi from "joi";

/**
 * Validation schemas for profit and loss related operations.
 * @typedef {Object} profitLossSchema
 */
const profitLossSchema = {

  /**
   * Schema for creating a new profit/loss entry.
   * @property {string} contract - Required. The contract associated with the trade.
   * @property {string} position_id - Required. The unique position ID for the trade.
   * @property {string} user_id - Required. The unique user ID who initiated the trade.
   * @property {string} qty - Required. The quantity of the asset involved in the trade.
   * @property {number} [trigger_profit] - Optional. The trigger value for profit.
   * @property {number} [trigger_loss] - Optional. The trigger value for loss.
   * @property {number} [profit_value] - Optional. The calculated profit value.
   * @property {number} [loss_value] - Optional. The calculated loss value.
   * @property {string} trade_type - Required. The type of trade (e.g., 'long', 'short').
   */
  create: Joi.object().keys({
    contract: Joi.string().required(),         // Required contract
    position_id: Joi.string().required(),      // Required position ID
    user_id: Joi.string().required(),          // Required user ID
    qty: Joi.string().required(),              // Required quantity of the asset
    trigger_profit: Joi.number().optional(),   // Optional trigger for profit
    trigger_loss: Joi.number().optional(),     // Optional trigger for loss
    profit_value: Joi.number().optional(),     // Optional calculated profit value
    loss_value: Joi.number().optional(),       // Optional calculated loss value
    trade_type: Joi.string().required(),       // Required trade type (e.g., 'long', 'short')
  }),

  /**
   * Schema for editing an existing profit/loss entry.
   * @property {string} id - Required. The unique identifier of the profit/loss entry to be edited.
   * @property {string} contract - Required. The contract associated with the trade.
   * @property {string} position_id - Required. The unique position ID for the trade.
   * @property {string} user_id - Required. The unique user ID who initiated the trade.
   * @property {string} qty - Required. The quantity of the asset involved in the trade.
   * @property {number} [trigger_profit] - Optional. The trigger value for profit.
   * @property {number} [trigger_loss] - Optional. The trigger value for loss.
   * @property {number} [profit_value] - Optional. The calculated profit value.
   * @property {number} [loss_value] - Optional. The calculated loss value.
   * @property {string} trade_type - Required. The type of trade (e.g., 'long', 'short').
   */
  edit: Joi.object().keys({
    id: Joi.string().required(),               // Required entry ID for editing
    contract: Joi.string().required(),         // Required contract
    position_id: Joi.string().required(),      // Required position ID
    user_id: Joi.string().required(),          // Required user ID
    qty: Joi.string().required(),              // Required quantity of the asset
    trigger_profit: Joi.number().optional(),   // Optional trigger for profit
    trigger_loss: Joi.number().optional(),     // Optional trigger for loss
    profit_value: Joi.number().optional(),     // Optional calculated profit value
    loss_value: Joi.number().optional(),       // Optional calculated loss value
    trade_type: Joi.string().required(),       // Required trade type (e.g., 'long', 'short')
  }),
};

export default profitLossSchema;

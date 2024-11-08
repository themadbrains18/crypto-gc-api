import Joi from "joi";

/**
 * Validation schemas for staking-related operations.
 * @typedef {Object} stakingSchema
 */
const stakingSchema = {

  /**
   * Schema for creating a new staking entry.
   * @property {string} user_id - Required. The ID of the user initiating the staking.
   * @property {string} token_id - Required. The ID of the token being staked.
   * @property {number} amount - Required. The amount to be staked. Must be a positive number.
   * @property {number} apr - Required. The annual percentage rate (APR) for the staking.
   * @property {number} time_log - Required. The timestamp of the staking action. Must be a positive number.
   * @property {string} time_format - Required. Format of the staking time (e.g., 'days', 'months').
   * @property {boolean} [status] - Optional. Status of the staking entry (e.g., active/inactive).
   * @property {boolean} [queue] - Optional. Indicates if the staking is queued for processing.
   * @property {boolean} [redeem] - Optional. Specifies if the staking can be redeemed.
   */
  create: Joi.object().keys({
    user_id: Joi.string().required(),
    token_id: Joi.string().required(),
    amount: Joi.number().positive().required(),
    apr: Joi.number().required(),
    time_log: Joi.number().positive().required(),
    time_format: Joi.string().required(),
    status: Joi.boolean().optional(),
    queue: Joi.boolean().optional(),
    redeem: Joi.boolean().optional(),
  }),

  /**
   * Schema for releasing a staking entry.
   * @property {string} id - Required. The unique identifier of the staking entry to release.
   * @property {number} step - Required. Step number in the release process.
   * @property {string} username - Required. Username associated with the staking release.
   * @property {string} otp - Required. One-time password for release authentication.
   */
  release: Joi.object().keys({
    id: Joi.string().required(),
    step: Joi.number().required(),
    username: Joi.string().required(),
    otp: Joi.string().required(),
  }),

  /**
   * Schema for creating or updating an admin-level staking configuration.
   * @property {string} token_id - Required. The ID of the token for the staking configuration.
   * @property {number} minimum_amount - Required. The minimum staking amount. Must be a positive number.
   * @property {number} apr - Required. The annual percentage rate (APR) for the staking.
   * @property {Array} lockTime - Required. Array of objects specifying lock duration and time format.
   *     - @property {number} duration - Required. The duration of the lock time. Must be positive.
   *     - @property {string} time - Required. Time format (e.g., 'days', 'months').
   * @property {boolean} [status=true] - Optional. Status of the staking configuration (default: true).
   */
  adminstake: Joi.object().keys({
    token_id: Joi.string().required(),
    minimum_amount: Joi.number().positive().required(),
    apr: Joi.number().required(),
    lockTime: Joi.array()
      .items(
        Joi.object({
          "duration": Joi.number().positive().required(),
          "time": Joi.string().required(),
        })
      )
      .required(),
    status: Joi.boolean().optional().default(true),
  }),
};

export default stakingSchema;

//* validators/withdraw.validator.js
// schemas.js
import Joi from "joi";

const withdrawSchema = {
  // trigger when list new a exchange
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
    username :Joi.string().required(),
    otp : Joi.string().required(),
    step :Joi.number().required(),
  }),
};

export default withdrawSchema;

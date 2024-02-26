//* validators/token.validator.js
// schemas.js
import Joi from "joi";

const networkSchema = {
  // trigger when list new a exchange
  create: Joi.object().keys({
    symbol: Joi.string().uppercase().min(3).max(10).required(),
    fullname: Joi.string().uppercase().min(3).max(70).required(),
    network: Joi.string().valid('mainnet','testnet').required(),
    user_id: Joi.string().required(),
    chainId: Joi.number().positive().greater(0).less(1000).optional(),
    walletSupport : Joi.string().valid('sol','tron','eth').required(),
    BlockExplorerURL: Joi.string().uri().required(),
    rpcUrl: Joi.string().uri().required(),

    
    
  }),

  // get specfic token token
  blogLIST: {
    page: Joi.number().required(),
    pageSize: Joi.number().required(),
  },
};

export default networkSchema;

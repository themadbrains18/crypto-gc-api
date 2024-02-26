//* validators/token.validator.js
// schemas.js
import Joi from "joi";

const tokenSchema = {
  // trigger when list new a exchange
  create: Joi.object().keys({
    symbol: Joi.string().uppercase().min(3).max(5).required(),
    fullName: Joi.string().regex(/^[a-zA-Z0-9, ]*$/, 'Alphanumerics, space and comma characters').min(3).max(30).required(),
    minimum_withdraw: Joi.number().required(),
    decimals: Joi.number().positive().greater(5).less(20).required(),
    tokenType: Joi.string().required(),
    image: Joi.string().optional(),
    status: Joi.boolean().default("false"),
    networks: Joi.array().items(Joi.object({
      "id": Joi.string().required(),
      // "abi": Joi.object().optional(),
      "fee": Joi.number().positive().greater(0.001).required(),
      "decimal": Joi.number().positive().greater(5).less(20).optional(),
      "contract": Joi.string().required(),
    })).required(),
    price: Joi.number().positive().greater(0).required(),
    min_price: Joi.number().positive().greater(0).required(),
    max_price: Joi.number().positive().greater(0).required(),
    type: Joi.string().required(),
    fees:Joi.number().optional()
  }),

  edit: Joi.object().keys({
    id: Joi.string().required(),
    symbol: Joi.string().uppercase().min(3).max(5).required(),
    fullName: Joi.string().regex(/^[a-zA-Z0-9, ]*$/, 'Alphanumerics, space and comma characters').min(3).max(30).required(),
    minimum_withdraw: Joi.number().required(),
    decimals: Joi.number().positive().greater(5).less(20).required(),
    tokenType: Joi.string().required(),
    image: Joi.string().allow(''),
    status: Joi.boolean().default("false"),
    networks: Joi.array().items(Joi.object({
      "id": Joi.string().required(),
      // "abi": Joi.object().optional(),
      "fee": Joi.number().positive().greater(0.001).required(),
      "decimal": Joi.number().positive().greater(5).less(20).optional(),
      "contract": Joi.string().required(),
    })).required(),
    price: Joi.number().positive().greater(0).required(),
    min_price: Joi.number().positive().greater(0).required(),
    max_price: Joi.number().positive().greater(0).required(),
    type: Joi.string().required(),
  }),

  // get specfic token token
  blogLIST: {
    page: Joi.number().required(),
    pageSize: Joi.number().required(),
  },
};

export default tokenSchema;

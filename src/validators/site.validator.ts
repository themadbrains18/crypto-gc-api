//* validators/token.validator.js
// schemas.js
import Joi from "joi";

const siteMaintenanceSchema = {
  // trigger when list new a exchange
  create: Joi.object().keys({
    user_id: Joi.string().required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
  }),

  edit: Joi.object().keys({

    user_id: Joi.string().required(),
    id: Joi.string().required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
    
  }),


};

export default siteMaintenanceSchema;

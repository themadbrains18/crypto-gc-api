import Joi, { required } from "joi";

const chatSchema={
    create : Joi.object().keys({
        post_id : Joi.string().required(),
        sell_user_id : Joi.string().required(),
        buy_user_id :Joi.string().required(),
        from : Joi.string().required(),
        to :Joi.string().required(),
        orderid : Joi.string().required(),
        chat:Joi.string().required()
    })
}

export default chatSchema;
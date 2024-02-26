import Joi from "joi";

const kycSchema = {
    // trigger when list new a exchange
    create: Joi.object().keys({
        userid: Joi.string().min(3).max(500).required(),
        country: Joi.string().required(),
        fname: Joi.string().required(),
        // lname: Joi.string().required(),
        doctype: Joi.string().required(),
        docnumber: Joi.string().required(),
        idfront:Joi.binary().encoding('utf8').optional(),
        idback:Joi.binary().encoding('utf8').optional(),
        statement:Joi.binary().encoding('utf8').optional(),
        destinationPath: Joi.string().optional(),
        dob : Joi.date().required(),
    }),

    status: Joi.object().keys({
        userid: Joi.string().min(3).max(500).required(),
        isVerified:Joi.boolean().optional(),
        isReject:Joi.boolean().optional(),
        user_id :Joi.string().optional()
    }),
};

export default kycSchema;
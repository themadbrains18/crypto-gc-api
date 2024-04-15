import Joi from "joi";
const now = Date.now();
const cutoffDate = new Date(now - (1000 * 60 * 60 * 24 * 365 * 18)); // go back by 21 years


const kycSchema = {
    // trigger when list new a exchange
    create: Joi.object().keys({
        user_id: Joi.string().min(3).max(500).required(),
        country: Joi.string().required(),
        fname: Joi.string().required(),
        // lname: Joi.string().required(),
        doctype: Joi.string().required(),
        docnumber: Joi.string().required().min(6).max(30),
        idfront:Joi.binary().encoding('utf8').optional(),
        idback:Joi.binary().encoding('utf8').optional(),
        statement:Joi.binary().encoding('utf8').optional(),
        destinationPath: Joi.string().optional(),
        dob : Joi.date().max(cutoffDate).required(),
    }),

    status: Joi.object().keys({
        userid: Joi.string().min(3).max(500).required(),
        isVerified:Joi.boolean().optional(),
        isReject:Joi.boolean().optional(),
        user_id :Joi.string().optional()
    }),
};

export default kycSchema;
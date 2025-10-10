import Joi from 'joi';

export const userRegistrationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    fullName: Joi.string().required(),
    nic: Joi.string().required()
})
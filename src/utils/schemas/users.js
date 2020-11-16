const joi = require('@hapi/joi');

const userIdSchema = joi.object({userId: joi.string().regex(/^[0-9a-fA-F]{24}$/) });



const createUserSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    name: joi.string().max(100).required(),
});

const createProviderUserSchema = joi.object({
    name: joi.string().max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    apiKeyToken: joi.string().required()
});

module.exports = {
    userIdSchema,
    createUserSchema,
    createProviderUserSchema
}
import joi from "joi";

const clientSchema = joi.object({
    name: joi.string().min(1).required(),
    phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/, 'numbers').required(),
    cpf:joi.string().length(11).pattern(/^[0-9]+$/, 'numbers').required(),
    birthday: joi.date().required()
});

export {clientSchema};
const Joi = require("@hapi/joi");
const db = require("./config");
//register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    admin: Joi.string(),
    age: Joi.number(),
    chronic:Joi.string()

  });
  return schema.validate(data);
};
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
const studyValidation = (data) => {
    const schema = Joi.object({
      name: Joi.string().min(6).required().email(),
      disease: Joi.string().min(6).required(),
    });
    return schema.validate(data);
  };


module.exports = {
  registerValidation,
  loginValidation,
  studyValidation
};

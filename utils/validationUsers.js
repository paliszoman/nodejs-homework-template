const joi = require("joi");

const userIsValid = joi.object({
  password: joi.string().min(5),
  email: joi.string().email(),
  subscription: joi.string(),
  token: joi.string(),
});

const validator = (schema) => (body) => {
  return schema.validate(body, { abortEarly: false });
};

const userValidator = validator(userIsValid);

module.exports = { userValidator };

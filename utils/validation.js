const joi = require("joi");

const postValidator = joi.object({
  name: joi.string().min(1).max(40).required(),
  email: joi.string().email({ minDomainSegments: 2, tlds: false }).required(),
  phone: joi.string().min(9).required(),
  favorite: joi.bool(),
});

const putValidator = joi.object({
  name: joi.string().min(1).max(40),
  email: joi.string().email({ minDomainSegments: 2, tlds: false }),
  phone: joi.string().min(9),
});

const patchValidator = joi.object({
  favorite: joi.bool(),
});

module.exports = { postValidator, putValidator, patchValidator };

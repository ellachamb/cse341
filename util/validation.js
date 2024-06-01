const Joi = require("joi");

module.exports.validateISBN = (isbnToCheck) => {
  const schema = Joi.string().regex(/^\d+$/).min(10).max(13);
  return schema.validate(isbnToCheck);
};

const Validator = require("validator");
const _ = require("lodash");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !_.isEmpty(data.email) ? data.email : "";
  data.password = !_.isEmpty(data.password) ? data.password : "";

  //Email Validator
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email field is not a valid email.";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required.";
  }

  //Password Validator
  if (Validator.isEmpty(data.password)) {
    errors.password = "password field is empty.";
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};
const EJV = require("express-joi-validation");

module.exports = EJV.createValidator({
  passError: true,
});

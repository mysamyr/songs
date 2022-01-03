const { PRODUCTION } = require("../constants");

if (process.env.NODE_ENV === PRODUCTION) {
	module.exports = require("./keys-prod");
} else {
	module.exports = require("./keys-dev");
}

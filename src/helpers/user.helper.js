const { URL } = require("../keys");

module.exports.getLinkForVerification = (id) => `${URL}auth/verify/${id}`;

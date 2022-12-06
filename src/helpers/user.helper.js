const { URL } = require("../config");

module.exports.getLinkForVerification = (id) => `${URL}auth/verify/${id}`;

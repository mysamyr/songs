const { URL } = require("../config");

module.exports.getLinkForVerification = (id) => `${URL}auth/verify/${id}`;

module.exports.getTimestampString = (date = new Date()) => `${date}`
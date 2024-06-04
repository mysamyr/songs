const crypto = require("node:crypto");

module.exports.uuid = () => crypto.randomBytes(16).toString("hex");

module.exports.hash = (string) =>
	crypto.createHash("sha256").update(string).digest("hex");

module.exports.compare = (string, hash) => module.exports.hash(string) === hash;

import crypto from "node:crypto";

export const uuid = () => crypto.randomBytes(16).toString("hex");

export const hash = (string) =>
	crypto.createHash("sha256").update(string).digest("hex");

export const compare = (string, hashedString) => hash(string) === hashedString;

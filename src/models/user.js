import { Schema, model } from "mongoose";
import { COLLECTIONS } from "../constants/index.js";

const opts = {
	toObject: {
		virtuals: true,
	},
	toJSON: {
		virtuals: true,
	},
	collection: "user",
};

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		link: {
			type: String,
		},
		verify_sent_at: {
			type: Date,
			required: true,
			default: new Date(),
		},
		verified: {
			type: Boolean,
			required: true,
			default: false,
		},
		is_admin: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	opts,
);

export default model(COLLECTIONS.USER, userSchema);

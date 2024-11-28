import { Schema, model } from "mongoose";
import { COLLECTIONS } from "../constants/index.js";

const opts = {
	toObject: {
		virtuals: true,
	},
	toJSON: {
		virtuals: true,
	},
	collection: "category",
};

const categorySchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		// only for info, will not be used in the app
		author: {
			type: Schema.Types.ObjectId,
			ref: COLLECTIONS.USER,
			required: true,
		},
		created_at: {
			type: Date,
			required: true,
			default: new Date(),
		},
	},
	opts,
);

export default model(COLLECTIONS.CATEGORY, categorySchema);

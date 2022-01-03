const { Schema, model } = require("mongoose");
const { COLLECTIONS } = require("../constants");

const opts = {
	toObject: {
		virtuals: true,
	},
	toJSON: {
		virtuals: true,
	},
	collection: "song",
};

const songSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: COLLECTIONS.USER,
			required: true,
		},
		text: {
			type: String,
			required: true,
			unique: true,
		},
		categories: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: COLLECTIONS.CATEGORY,
				},
			],
			required: true,
		},
		created_at: {
			type: Date,
			required: true,
			default: new Date(),
		},
		deleted: {
			type: Boolean,
			required: true,
			default: false,
		},
		deleted_at: {
			type: Date,
		},
	},
	opts,
);

module.exports = model(COLLECTIONS.SONG, songSchema);

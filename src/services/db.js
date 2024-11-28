import mongoose from "mongoose";

export const transaction = async (cb) => {
	const session = await mongoose.connection.startSession();

	let result;
	await session.withTransaction(async (s) => {
		result = await cb(s);
	});
	await session.endSession();

	return result;
};

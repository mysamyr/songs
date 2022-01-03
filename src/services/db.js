const { connection } = require("mongoose");

module.exports = {
	async transaction(cb) {
		const session = await connection.startSession();

		let result;
		await session.withTransaction(async (s) => {
			result = await cb(s);
		});
		await session.endSession();

		return result;
	},
};

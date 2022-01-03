module.exports = {
	ifneq(a, b, options) {
		if (a !== b) {
			return options.fn(this);
		}
		return options.inverse(this);
	},
	ifor(a, b, options) {
		if (a || b) {
			return options.fn(this);
		}
		return options.inverse(this);
	},
};

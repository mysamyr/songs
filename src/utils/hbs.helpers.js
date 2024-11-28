export const ifneq = (a, b, options) => {
	if (a !== b) {
		return options.fn(this);
	}
	return options.inverse(this);
};

export const ifor = (a, b, options) => {
	if (a || b) {
		return options.fn(this);
	}
	return options.inverse(this);
};

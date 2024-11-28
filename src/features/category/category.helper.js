export const sortByName = (arr) =>
	arr
		.map((i) => i.toObject())
		.sort((x, y) => {
			if (x.name < y.name) return -1;
			if (x.name > y.name) return 1;
			return 0;
		});

export const capitalize = (str) => str[0].toUpperCase() + str.substring(1);

export const mapCategories = (categories) => {
	const sortedCategories = sortByName(categories);
	return sortedCategories.map((c) => ({
		id: c.id,
		name: capitalize(c.name),
	}));
};

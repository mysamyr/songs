const sortByName = (arr) =>
	arr
		.map((i) => i.toObject())
		.sort((x, y) => {
			if (x.name < y.name) return -1;
			if (x.name > y.name) return 1;
			return 0;
		});
const capitalize = (str) => str[0].toUpperCase() + str.substring(1);

const mapCategories = (categories) => {
	const sortedCategories = sortByName(categories);
	return sortedCategories.map((c) => ({
		id: c.id,
		name: capitalize(c.name),
	}));
};

module.exports = {
	sortByName,
	capitalize,
	mapCategories,
};

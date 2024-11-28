export const separateCategories = (categories, song) =>
	categories.reduce(
		(acc, category) => {
			if (song.categories.includes(category.id)) {
				acc.currents.push({ name: category.name });
			} else {
				acc.categories.push({ name: category.name });
			}
			return acc;
		},
		{
			currents: [],
			categories: [],
		},
	);

export const makeAddSongUrlAfterError = ({ name, text }) =>
	`/song/add?name=${name}&text=${text}`;

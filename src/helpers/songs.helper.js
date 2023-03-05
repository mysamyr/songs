module.exports.separateCategories = (categories, song) => {
  return categories.reduce(
    (acc, c) => {
      if (song.categories.includes(c._id)) {
        acc.currents.push({ name: c.name });
      } else {
        acc.categories.push({ name: c.name });
      }
      return acc;
    },
    {
      currents: [],
      categories: [],
    },
  );
};
module.exports.makeAddSongUrlAfterError = ({ name, text }) => `/song/add?name=${name}&text=${text}`;

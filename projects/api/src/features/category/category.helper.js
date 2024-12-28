const sortByName = arr =>
  arr.sort((x, y) => {
    if (x.name < y.name) return -1;
    if (x.name > y.name) return 1;
    return 0;
  });

export const mapCategories = categories => {
  const sortedCategories = sortByName(categories);
  return sortedCategories.map(c => ({
    id: c.id,
    name: c.name,
  }));
};

const mapSongs = songs => {
  const sortedSongs = sortByName(songs);
  return sortedSongs.map(s => ({
    id: s.id,
    name: s.name,
  }));
};

export const mapCategoryWithSongs = (category, songs) => ({
  categoryName: category.name,
  categoryId: category._id.toString(),
  songs: mapSongs(songs),
});

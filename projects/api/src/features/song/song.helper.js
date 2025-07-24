export const mapSong = (song, user) => ({
  id: song._id.toString(),
  name: song.name,
  author: song.author,
  text: song.text,
  categories: song.categories.map(category => category._id.toString()),
  owner: song.owner?.name,
  isOwner: song.owner?._id?.toString() === user.id,
});

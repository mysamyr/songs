export const mapSong = (song, user) => ({
  id: song._id.toString(),
  name: song.name,
  text: song.text,
  categories: song.categories.map(category => category._id.toString()),
  author: song.author?.name,
  isAuthor: song.author?._id?.toString() === user.id,
});

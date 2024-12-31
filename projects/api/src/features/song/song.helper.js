export const mapSong = (song, user) => ({
  title: song.name,
  name: song.name,
  author: song.author?.name,
  isAuthor: song.author?._id?.toString() === user.id,
  text: song.text,
  id: song._id.toString(),
});

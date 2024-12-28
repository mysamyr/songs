export const mapSong = song => ({
  title: song.name,
  name: song.name,
  author: song.author?.name,
  text: song.text,
  id: song._id.toString(),
});

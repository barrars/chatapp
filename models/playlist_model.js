const mongoose = require('mongoose')

const playlist_schema = mongoose.Schema({
  playlist_name: { type: String },
  created_by: { type: String }

}, { timestamp: true })

const Playlist = module.exports = mongoose.model('Playlist', playlist_schema)
Playlist.create_new_playlist = create_new_playlist

async function create_new_playlist ({ playlist_name, created_by }) {
  let new_playlist = await new Playlist({
    playlist_name, created_by
  })
  logger.log({ new_playlist })
  let saved_playlist = await new_playlist.save()
  if (!saved_playlist) throw 'Eror saving playlist'
  logger.log(saved_playlist)
  logger.log({ saved_playlist })
  return saved_playlist
}

// Get all playlist, or get only users playlist

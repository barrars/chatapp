
const logger = require('../routes/myLogger')
logger.trace(new Date())
const mongoose = require('mongoose')

const playlistScheema = mongoose.Schema({
  playlistName: { type: String },
  createBy: { type: String }

}, { timestamp: true })

const Playlist = module.exports = mongoose.model('Playlist', playlistScheema)
Playlist.createNewPlaylist = createNewPlaylist
Playlist.getAllPlaylists = getAllPlaylists
Playlist.getMyPLaylist = getMyPLaylist

async function createNewPlaylist ({ playlistName, createBy }) {
  const newPlaylist = await new Playlist({
    playlistName, createBy
  })
  logger.log({ newPlaylist })
  const savedPlaylist = await newPlaylist.save()
  if (!savedPlaylist) throw Error('Eror saving playlist')
  logger.log(savedPlaylist)
  logger.log({ savedPlaylist })
  return savedPlaylist
}

// Get all playlist, or get only users playlist
async function getAllPlaylists () {
  const playlists = await Playlist.find().limit(15)
  return playlists
}

async function getMyPLaylist (req) {
  const createBy = req.session.id
  const myPlaylist = await Playlist.find({ createBy }).limit(15)
  return myPlaylist
}

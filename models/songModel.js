const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')

// const logger = require('../routes/myLogger')
// logger.trace(new Date())
const songSchema = mongoose.Schema({
  name: { type: String, required: true },
  artist: { type: String },
  youtubeUrl: { type: String },
  thumbnailUrl: { type: String },
  fileSlug: { type: String, required: true, unique: true },
  createdBy: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }

})

const Song = module.exports = mongoose.model('songs', songSchema)
Song.create = create

async function create (song) {
  const newSong = await new Song(addFileSlug(song))

  // not actually sure this will work
  if (!newSong.save()) {
    throw 'Error saving playlist'
  }
  return newSong
}

function addFileSlug (song) {
  song.fileSlug = uuidv4() // ⇨ '10ba038e-48da-487b-96e8-8d3b99b6d18a'

  return song
}

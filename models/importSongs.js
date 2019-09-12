const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')
const fs = require('fs-extra')
const path = require('path')
// const logger = require('../routes/myLogger')
// logger.log(new Date())

const songSchema = mongoose.Schema({
  title: { type: String, required: true },
  fileName: { type: String, required: true },
  artist: { type: String },
  youtubeUrl: { type: String },
  thumbnailUrl: { type: String },
  plays: { type: Number, default: 0 },
  fileSlug: { type: String, required: true, unique: true },
  createdBy: { type: String, required: true, default: 'rambo' },
  timestamp: { type: Date, default: Date.now }

})
const Song = module.exports = mongoose.model('songsList', songSchema)
// logger.log(Song.find()
//   .then(results => {
//     logger.log(results)
//   }))

fs.readdir(path.join(__dirname, '../public/downloads'), (err, files) => {
  if (err) {
    throw err
  }
  files.forEach(file => {
    // logger.log(file)
    Song.find({ title: file }, (err, docs) => {
      if (err) {
        throw err
      }
      if (!docs.length) {
        Song.create({ title: file, fileName: file })
      }
    })
  })
})
Song.create = create

async function create (song) {
  // logger.trace(song)
  const newSong = await new Song(addFileSlug(song))

  // not actually sure this will work
  if (!newSong.save()) {
    throw 'Error saving playlist'
  }
  // logger.trace(newSong)
  return newSong
}

function addFileSlug (song) {
  // logger.trace(song)
  song.fileSlug = uuidv4() // ⇨ '10ba038e-48da-487b-96e8-8d3b99b6d18a'
  // logger.trace(song)

  return song
}

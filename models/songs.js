const mongoose = require('mongoose')
const { Schema } = mongoose
const uuidv4 = require('uuid/v4')
const fs = require('fs-extra')
const path = require('path')
const logger = require('../routes/myLogger')
// logger.log(new Date())

const songSchema = new Schema({
  title: { type: String, required: true },
  fileName: { type: String, required: true },
  artist: { type: String },
  youtubeUrl: { type: String },
  thumbnailUrl: { type: String },
  plays: { type: Number, default: 0 },
  fileSlug: { type: String, required: true, unique: true },
  createdBy: { type: String, required: true, default: 'rambo' },
  lastPlayed: { type: Date, default: Date.now },
  downloaded: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false }

})

const Song = module.exports = mongoose.model('songs', songSchema)

fs.readdir(path.join(__dirname, '../public/downloads'))
  .then(files => {
    files.forEach(file => {
      Song.find({ fileName: file }, (err, doc) => {
        if (err) {
          throw err
        }
        if (!doc.length) {
          console.log(doc.length)
          logger.log('creating')
          fs.stat(path.join(__dirname, '../public/downloads', file))
            .then(data => {
              logger.log(data.ctimeMs)
              logger.log(file)
              Song.create({ title: file, fileName: file, downloaded: data.ctimeMs })
            })
        }
      })
    })
  })

Song.create = create

async function create (song) {
  const newSong = await new Song(addFileSlug(song))

  if (!newSong.save()) {
    throw Error('Error saving playlist')
  }
  return newSong
}

function addFileSlug (song) {
  song.fileSlug = uuidv4()

  return song
}

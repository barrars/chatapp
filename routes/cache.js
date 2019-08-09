const fs = require('fs-extra')
const path = require('path')
const logger = require('./myLogger')

exports.cacheSongs = (cb) => {
  logger.log('Caching scotts songs yay!'.red)
  fs.readdir(path.join(__dirname, '/../public/downloads'), (err, files) => {
    if (err) {
      logger.log(err)
    }

    cb(files)
    // console.log(songList)
    // exports.songList = songList
    // console.log(songList)
    // return songList

    // exports.songs = songList
  })
}

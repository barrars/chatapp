const logger = require('../routes/myLogger')
logger.trace(new Date())
const fs = require('fs-extra')

const path = require('path')

exports.cacheSongs = (cb) => {
  logger.log('Caching scotts songs yay!'.red)
  fs.readdir(path.join(__dirname, '/../public/downloads'))
    .then((files) => cb(files))
    .catch(err => logger.trace(err))
    // if (err) {
    // 	logger.log(err)
    // }

  // cb(files)

  // console.log(songList)
  // exports.songList = songList
  // console.log(songList)
  // return songList

  // exports.songs = songList
}

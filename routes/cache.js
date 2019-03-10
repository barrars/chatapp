const fs = require('fs-extra')
const path = require('path')
exports.cacheSongs = (cb) => {
  // console.log('Caching scotts songs yay!'.red)
  fs.readdir(path.join(__dirname, '/../public/downloads'), (err, files) => {
    if (err) {
      console.log(err)
    }

    cb(files)
    // console.log(songList)
    // exports.songList = songList
    // console.log(songList)
    // return songList

    // exports.songs = songList
  })
}

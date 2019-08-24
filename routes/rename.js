const logger = require('./myLogger')
logger.trace(new Date())

const fs = require('fs-extra')
var colors = require('colors')
// rename( __dirname +'/../public/downloads/', '.mp3', '')

module.exports = function renameExt (dir, oldExt, newExt) {
  logger.log('!!!!!!!!!!!!!!' + dir)

  fs.readdir(dir, (er, files) => {
    if (er) {
      logger.error(er)
    }
    logger.log(files)
    for (const key in files) {
      if (files.hasOwnProperty(key)) {
        fs.rename(dir + files[key], dir + files[key].replace(oldExt, newExt), () => {
          logger.log('done')
        })
      }
    }
  })
}

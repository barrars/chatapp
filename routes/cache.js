const logger = require('../routes/myLogger')
// logger.trace(new Date())
const fs = require('fs-extra')
const path = require('path')
exports.cacheSongs = cb => {
  logger.log('Caching scotts songs yay!'.red)
  fs.readdir(path.join(__dirname, '/../public/downloads'))
    // .then(chat)
    // .then(logger.info(chat))
    // .then(logger.log(chat.find()))
    .then(files => cb(files))
    .catch(err => logger.trace(err))
}

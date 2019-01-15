const fs = require('fs')
var colors = require('colors')
var logger = require('tracer').colorConsole({
  format:
    '{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})',
  dateformat: 'HH:MM:ss.L',
  filters: {
    log: [colors.underline, colors.white],
    trace: colors.magenta,
    debug: colors.blue,
    info: colors.green,
    warn: colors.yellow,
    error: [colors.red, colors.bold]
  }
})
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

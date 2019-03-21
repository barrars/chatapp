var exec = require('child_process').exec
var colors = require('colors')
const chalk = require('chalk')
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
var io = require('./sockets').io()
module.exports = {
  // addSong (arr, song) {
  //   arr.push(song)
  // },
  // get_song_list (cb) {
  //   return cb(list)
  // },
  download (data) {
    logger.log(chalk.yellowBright('server received getsong event from' + data))
    const youtubedl = exec(
      `youtube-dl "ytsearch:${data}" --config-location . `,
      error => {
        if (!error === null) {
          logger.log(error)
          io.emit('error')
        }
      }
    )

    youtubedl.on('close', code => {
      logger.log(code)
      if (code === 1) {
        io.emit('error')
      }
    })

    youtubedl.stderr.on('data', data => {
      logger.log(`stderr: ${data}`)
    })

    youtubedl.stdout.on('data', function (stdout) {
      logger.log('STDOUT = ', stdout)
      if (stdout.toLocaleLowerCase().indexOf('%') > 0) {
        var percent = stdout.match(/(\d+).\d%/g)[0]
        io.emit('percent', percent)
      }
      if (stdout.toLocaleLowerCase().indexOf('mp3') > 0) {
        youtubedl.on('close', code => {
          if (code) return logger.log('Error'.red)
          let title = stdout.slice(41)
          require('./sockets').add_song_to_cache(title)
          io.emit('title', title)
        })
      }
      if (stdout.toLocaleLowerCase().indexOf('archive') > 0) {
        youtubedl.on('close', code => {
          logger.log(code)
          if (code === 0) {
            io.emit('archive')
          }
        })
      }
    })
  }
}

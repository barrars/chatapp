const logger = require('./myLogger')
logger.trace(new Date())

var exec = require('child_process').exec

var io = require('./sockets').io()
const songModel = require('../models/songModel.js')

module.exports = {
  // addSong (arr, song) {
  //   arr.push(song)
  // },
  // get_song_list (cb) {
  //   return cb(list)
  // },
  download (data) {
    console.log(data)

    logger.log(('server received getsong event from' + data))
    const youtubedl = exec(
      `youtube-dl "ytsearch:${data.song}" --config-location . `,
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

          songModel.create({ name: title, createdBy: data.user })
            .then(song => {
              logger.log(`Song Created: ${song}`)
              io.emit('title', title)
              songModel.find()
                .then(results => {
                  logger.log(results)
                  io.emit('results', results)
                })
            })
            .catch(err => {
              logger.log(err)
              // TODO pass errors to client
            })
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

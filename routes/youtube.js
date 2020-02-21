const logger = require('./myLogger')
var exec = require('child_process').exec
var io = require('./sockets').io()
const songList = require('../models/songs')
let youtubedl
module.exports = {
  download (data) {
    logger.log('server received getsong event from' + JSON.stringify(data))
    if (data.song.startsWith('http' || 'https' || 'www')) {
      youtubedl = exec(
        `youtube-dl "${data.song}" --config-location . `,
        error => {
          if (!error === null) {
            logger.log(error)
            io.emit('error')
          }
        }
      )
    } else {
      youtubedl = exec(
        `youtube-dl "ytsearch:${data.song}" --config-location . `,
        error => {
          if (!error === null) {
            logger.log(error)
            io.emit('error')
          }
        }
      )
    }
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
          const title = stdout.slice(41).trim()
          logger.log('TITLE')
          logger.log(stdout)

          songList
            .create({ title: title, createdBy: data.user, fileName: title })
            .then(song => {
              logger.log(`Song Created: ${song}`)
              console.log(title)

              io.emit('title', title)
              // songList.find()
              //   .then(results => {
              //     logger.log(results)
              //     io.emit('results', results)
              //   })
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
            logger.error('archive')
            io.emit('archive')
          }
        })
      }
    })
  }
}

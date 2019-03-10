const fs = require('fs-extra')
const path = require('path')
const colors = require('colors')
const logger = require('tracer').colorConsole({
  format: '{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})',
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
let songs
const io = require('socket.io')()
require('./ip').uniqeVisits()
// let songCache = require('./cache').songList
const cache = require('./cache').cacheSongs

exports.io = function () {
  return io
}
exports.add_song_to_cache = (new_song) => {
  logger.log({
    new_song
  })
  logger.log(songs.length)

  songs.push(new_song)
  // logger.log(songs)
}

const myClients = {}
io.on('connection', function (socket) {
  console.log('socket on connection')
  cache((data) => {
    logger.log(data.length)
    logger.log(data)
    socket.emit('files', data)
    songs = data

    logger.log(songs)
  })

  socket.on('rename', (data) => {
    console.log('socket on rename')

    logger.log(data)
    fs.rename(path.join(__dirname, '/../public/downloads/' + data.oldName), path.join(__dirname, '/../public/downloads/' + data.newName), (err) => {
      if (err) {
        throw err
      }
      console.log(`${data.oldName} has been renamed to ${data.newName}`)
      socket.broadcast.emit('renamed', data)
      socket.emit('renamed', data)
    })
  })
  socket.on('set_name', function (data) {
    logger.log('socket on SET NAME'.green)
    logger.log(data)
    socket.emit('name_set', data)

    logger.log('Emiting a socke of scotts songs!!'.magenta)
    // socket.emit('files', songCache)

    socket.nickname = data.name
    logger.log(socket.nickname)
    socket.color = data.color

    myClients[socket.id] = socket.nickname
    logger.log(myClients)
    socket.emit('list', {
      name: socket.nickname,
      id: socket.id,
      event: 'set_name',
      clients: myClients,
      color: socket.color
    })
    socket.broadcast.emit('list', {
      name: socket.nickname,
      id: socket.id,
      event: 'set_name',
      color: socket.color
    })
    logger.log('nick ', socket.nickname)
    logger.log(data)
    socket.send(JSON.stringify({
      type: 'serverMessage',
      message: 'Welcome ' + data.name
    }))
    socket.on('disconnect', () => {
      console.log('socket on disconnect')

      logger.log(myClients)
      // logger.log(socket)
      socket.broadcast.emit('userLeft', socket.id)
      logger.log(socket.nickname, socket.id, ' has left')
      delete myClients[socket.id]
    })
    socket.broadcast.emit('user_entered', data)
  })
  socket.on('getsong', require('./youtube.js').download)
  // console.log('socket on getsong')

  socket.on('songClick', (data) => {
    console.log('socket on songClick')

    logger.log(data)
    socket.broadcast.emit('shareTrack', data)
    socket.emit('shareTrack', data)
  })
  socket.on('playing', (data) => {
    console.log('socket on playing')

    // logger.log(socket)
    // data.type = 'serverMessage',
    // logger.log(data)

    logger.log(data.name, '  is playing!!!')
    // logger.log('data == ', data);

    // socket.broadcast.emit('play')
    socket.emit('play', data)
  })
  socket.on('message', function (message) {
    console.log('socket on message')

    message = JSON.parse(message)
    logger.log(message)

    if (message.type === 'userMessage') {
      socket.nickname = message.username
      logger.log(message, socket.id)
      socket.broadcast.send(JSON.stringify(message))
      message.type = 'myMessage'
      socket.send(JSON.stringify(message))
    }
  })
})

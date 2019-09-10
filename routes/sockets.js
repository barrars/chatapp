const logger = require('../routes/myLogger')
const fs = require('fs-extra')
const path = require('path')
const songModel = require('../models/songModel')
const chatModel = require('../models/chatModel')
const search = require('./search').search
const songs = require('../models/importSongs')
const io = require('socket.io')()
require('./ip').uniqeVisits()
exports.io = function () {
  return io
}
const myClients = {}
songs()
io.on('connection', function (socket) {
  socket.on('random', data => {
    logger.log(data)
  })
  songModel.find().then(results => {
    // logger.log(results)
    io.emit('results', results)
  })
  logger.log('socket on connection')
  // cache(data => {
  // logger.log(new Date());

  //   logger.log(`${data.length} of songs in cache`)
  //   socket.emit('files', data)
  //   songs = data

  // })
  socket.on('search', data => {
    // let itunes

    // logger.info(data)
    const results = search(data)
    if (results) {
      logger.info('results!!!!')

      socket.emit('results', results)
    }
  })
  socket.on('delete', data => {
    logger.log(`delete ${JSON.stringify(data)}`)
    fs.move(
      path.join(__dirname, '/../public/downloads/' + data.song),
      path.join(__dirname, '/../public/deleted/' + data.song),
      (err, suc) => {
        if (err) return err
        console.log(suc)

        logger.log('deleted ', data)
        socket.broadcast.emit('deleted', data)
        socket.emit('deleted', data)
      }
    )
  })
  socket.on('rename', data => {
    logger.log('socket on rename')

    logger.log(data)
    songs.findOneAndRemove({ title: data.oldName }, { title: data.newName })
    // logger.log(songs)
    fs.rename(
      path.join(__dirname, '/../public/downloads/' + data.oldName),
      path.join(__dirname, '/../public/downloads/' + data.newName),
      err => {
        if (err) {
          throw err
        }
        logger.log(
          `${data.oldName.red} ${'has been renamed to'.magenta}  ${
            data.newName
          }`
        )
        socket.broadcast.emit('renamed', data)
        socket.emit('renamed', data)
      }
    )
  })
  socket.on('set_name', function (data) {
    socket.emit('name_set', data)
    socket.nickname = data.name
    socket.color = data.color
    myClients[socket.id] = socket.nickname
    logger.log(`myClients = ${JSON.stringify(myClients)}`)
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
    socket.send(
      JSON.stringify({
        type: 'serverMessage',
        message: 'Welcome ' + data.name
      })
    )
    socket.on('disconnect', () => {
      // logger.log('socket on disconnect')

      logger.log(`myClients = ${JSON.stringify(myClients)}`)
      // logger.log(socket)
      socket.broadcast.emit('userLeft', socket.id)
      logger.log(`userName ${socket.nickname} and ID ${socket.id}  has left`)
      delete myClients[socket.id]
    })
    socket.broadcast.emit('user_entered', data)
  })
  socket.on('getsong', require('./youtube.js').download)
  // logger.log('socket on getsong')

  socket.on('songClick', data => {
    logger.log(data)
    socket.broadcast.emit('shareTrack', data)
    socket.emit('shareTrack', data)
  })
  socket.on('playing', data => {
    logger.log('socket on playing')

    // logger.log(socket)
    // data.type = 'serverMessage',
    // logger.log(data)

    logger.log(data.name, '  is playing!!!')
    // logger.log('data == ', data);

    // socket.broadcast.emit('play')
    socket.emit('play', data)
  })
  socket.on('message', function (message) {
    logger.log(`socket on message ${message}`)

    chatModel.create(JSON.parse(message))
    message = JSON.parse(message)
    logger.log(message)

    if (message.type === 'userMessage') {
      // songModel.create({ name: title, createdBy: data.user })

      socket.nickname = message.username
      logger.log(message, socket.id)
      socket.broadcast.send(JSON.stringify(message))
      message.type = 'myMessage'
      socket.send(JSON.stringify(message))
    }
  })
})

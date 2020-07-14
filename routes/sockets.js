const logger = require('../routes/myLogger')
const fs = require('fs-extra')
const path = require('path')
const chatModel = require('../models/chatModel')
const search = require('./search').search
const songs = require('../models/songs')
const io = require('socket.io')()
require('./ip').uniqeVisits()
exports.io = function () {
  return io
}
const myClients = {}
// songs()
io.on('connection', function (socket) {
  socket.on('random', data => {
    logger.log(data)
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
    songs.findOneAndUpdate({ fileSlug: data.id }, { deleted: true }, { new: true, useFindAndModify: false }, (err, doc) => {
      if (err) {
        logger.error(err)
        throw new Error()
      }
      // data.doc = doc
      console.log(doc)
      logger.log('deleted ', data)
      socket.broadcast.emit('deleted', data)
      socket.emit('deleted', data)
      logger.log(`${doc.title} deleted`)
    })
    // fs.move(
    //   path.join(__dirname, '/../public/downloads/' + data.song),
    //   path.join(__dirname, '/../public/deleted/' + data.song),
    //   (err, suc) => {
    //     if (err) return err
    //     logger.log(suc)

    //     logger.log('deleted ', data)
    //     socket.broadcast.emit('deleted', data)
    //     socket.emit('deleted', data)
    //   }
    // )
  })
  socket.on('rename', data => {
    logger.log('socket on rename')

    logger.log(data)
    songs.findOneAndUpdate({ fileSlug: data.id }, { title: data.newName }, { new: true, useFindAndModify: false }, (err, doc) => {
      if (err) {
        logger.error(err)
        throw new Error()
      }
      socket.broadcast.emit('renamed', doc)
      socket.emit('renamed', doc)
      logger.log(`${doc.title} has been renamed via socket event`)
    })
    // const songPath = (path) => '/../public/downloads/' + path
    // fs.rename(
    //   path.join(__dirname, songPath(data.oldName)),
    //   path.join(__dirname, songPath(data.newName)),
    //   err => {
    //     if (err) {
    //       throw err
    //     }
    //     logger.log(
    //       `${data.oldName.red} ${'has been renamed to'.magenta}  ${
    //         data.newName
    //       }`
    //     )
    //   }
    // )
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
  socket.on('songClick', data => {
    logger.log(data)
    songs.findOneAndUpdate({ fileSlug: data.id }, { $inc: { plays: 1 }, lastPlayed: Date.now() }, { new: true, useFindAndModify: false }, (err, doc) => {
      if (err) {
        logger.error(err)
        throw new Error()
      }
      logger.log(`${doc} updated`)
      logger.log(data)
      socket.broadcast.emit('shareTrack', { data, doc })
      socket.emit('shareTrack', { data, doc })
    })
  })
  socket.on('playing', data => {
    logger.log('socket on playing')
    logger.log(data.name, '  is playing!!!')
    socket.emit('play', data)
  })
  socket.on('message', function (message) {
    logger.log(`socket on message ${message}`)
    message = JSON.parse(message)
    chatModel.create(message)
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

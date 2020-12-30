const logger = require('../routes/myLogger')
const chatModel = require('../models/chatModel')
const search = require('./search').search
const songs = require('../models/songs')
const users = require('../models/users')
const io = require('socket.io')()
require('./ip').uniqeVisits()
exports.io = function () {
  return io
}
logger.log(io.sockets.adapter.rooms)
const myClients = {}
io.on('connection', function (socket) {
  logger.log(io.of('/').allSockets())
  logger.log(io.of('/scotts').allSockets())
  // logger.log(io.of('/').sockets)
  // logger.log(io.sockets.adapter.rooms)
  // logger.log(io.onconnection(socket))
  // logger.log(io.sockets)
  // logger.log(socket.handshake)
  socket.on('random', data => {
    logger.log(data)
  })
  socket.on('ding', id => {
    // logger.log(id)
    logger.log(socket)
    socket.join('/scotts')
    function listRooms (count) {
      io.sockets.adapter.rooms.forEach((value, key, map) => {
        logger.log(`room${count}: ${key}`)
        logger.log('--------------------------')
        logger.log(`sockets: ${JSON.stringify([...value])}`)
        logger.log('--------------------------')
        count++
      })
    }
    // listRooms(1)
    io.to(id).emit('hey', 'i <3 u!')
  })

  socket.on('search', data => {
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
  })
  socket.on('set_name', async function (data) {
    users.createUser(data)
    socket.emit('name_set', data)
    const playlist = await users.playlist(data)
    if (playlist) {
      // logger.log(playlist)
      // logger.log(playlist.playlist)
      socket.emit('playlist', playlist.playlist)
    }

    socket.nickname = data.name
    socket.color = data.color
    myClients[socket.id] = socket.nickname
    logger.log(`myClients = ${JSON.stringify(myClients)}`)
    socket.emit('userList', {
      name: socket.nickname,
      id: socket.id,
      event: 'userList',
      clients: myClients,
      color: socket.color
    })
    socket.broadcast.emit('userList', {
      name: socket.nickname,
      id: socket.id,
      event: 'userList',
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
  socket.on('addToPlaylist', data => {
    // users.playlist(data)
    logger.log(data)
    users.findOneAndUpdate({ name: data.myId }, {
      $addToSet: { favorites: data.slug }
    }, { upsert: true, new: true })
      .then(doc => logger.log(doc))
      .catch(err => console.error(err))

    // .populate('playlist')
    // .exec(function (err, songs) {
    //   if (err) {
    //     logger.error(err)
    //   }
    //   if (songs) {
    //     logger.log(songs)
    //     socket.emit('playlist', songs.playlist)
    //   }
    // })
  })
  socket.on('songClick', data => {
    // logger.log(data)
    songs.findOneAndUpdate({ fileSlug: data.id }, { $inc: { plays: 1 }, lastPlayed: Date.now() }, { new: true, useFindAndModify: false }, (err, doc) => {
      if (err) {
        logger.error(err)
        throw new Error()
      }
      logger.log(`${doc} updated`)
      // socket.broadcast.emit('shareTrack', { data, doc })
      io.emit('shareTrack', { data, doc })
    })
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
      socket.send(JSON.stringify(message))
      // message.type = 'myMessage'
    }
  })
})

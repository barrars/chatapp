var fs = require('fs')
var path = require('path')
var colors = require('colors')
var logger = require('tracer').colorConsole({
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
var io = require('socket.io')()
require('./is').uniqeVisits()

exports.io = function () {
  return io
}

const myClients = {}
io.on('connection', function (socket) {
  socket.on('disconnect', () => {
    // logger.log(socket)
    delete myClients[socket.id]
    io.emit('userLeft', socket.id)
    logger.log(socket.nickname, socket.id, ' has left')
  })
  // socket.emit('fuck')
  socket.on('rename', (data) => {
    console.log('sup!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log(data)
    fs.rename(path.join(__dirname, '/../public/downloads/' + data.oldName), path.join(__dirname, '/../public/downloads/' + data.newName), (err) => {
      if (err) {
        throw err
      }
      console.log(`${data.oldName} has been renamed to ${data.newName}`)

    })
  })
  // socket.on('getList', () => {
  // })
  socket.on('songClick', (data) => {
    logger.log(data)
    socket.broadcast.emit('shareTrack', data)
    socket.emit('shareTrack', data)
  })
  socket.on('set_name', function (data) {
    fs.readdir(path.join(__dirname, '/../public/downloads'), (err, files) => {
      if (err) {
        logger.log(err)
      } else {
        // logger.log('readdir files list = ' + files)
        // socket.emit('files_data', files)

        logger.log('Files ', typeof files)
        socket.emit('files', files)
        // files.forEach(file => {
        //   logger.log('file = ' + file)
        // })
      }
    })
    socket.nickname = data.name
    socket.color = data.color
    // logger.log(data)
    // logger.log(socket.nickname)
    // logger.log('nickname= ', typeof socket.nickname)
    myClients[socket.id] = socket.nickname
    logger.log(myClients)
    socket.emit('list', {
      name: socket.nickname,
      id: socket.id,
      event: 'set_name',
      clients: myClients,
      color: socket.color })
    socket.broadcast.emit('list', { name: socket.nickname, id: socket.id, event: 'set_name', color: socket.color })
    // logger.log('nick ', socket.nickname);
    socket.emit('name_set', data)
    logger.log(data)
    socket.send(JSON.stringify({
      type: 'serverMessage',
      message: 'Welcome ' + data.name
    }))
    socket.broadcast.emit('user_entered', data)
  })
  socket.on('getsong', require('./youtube.js'))

  socket.on('playing', (data) => {
    // logger.log(socket)
    // data.type = 'serverMessage',
    // logger.log(data)

    logger.log(data.name, '  is playing!!!')
    // logger.log('data == ', data);

    // socket.broadcast.emit('play')
    socket.emit('play', data)
  })
  socket.on('message', function (message) {
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

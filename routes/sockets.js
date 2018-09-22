// const chalk = require('chalk');
// var exec = require('child_process').exec
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

exports.io = function () {
  return io
}
// var io = null;

// var youtube = require('./myMod')
// let getSongList = fs.readdir(__dirname + '/../public/downloads', (err, files) => {
//   if (err) {
//     logger.log(err)
//   } else {
//     // logger.log('readdir files list = ' + files)
//     // socket.emit('files_data', files)

//     let filesList = []
//     files.forEach(file => {
//       filesList.push(file)

//       // logger.log('file = ' + file )
//     })
//     // logger.log(filesList);
//     return filesList
//   }
// })

const myClients = {}

var chatInfra = io.of('/chat_infra').on('connection', function (socket) {
  // console.log('infra!!!!!!', io.of('chatInfra'));

  // var allInfra = io.in('chatInfra')
  socket.on('getList', () => {

  })
  socket.on('songClick', (data) => {
    console.log('alyica needs to focus!!!!!', data)
    chatInfra.emit('shareTrack', data)
    // io.of('chatInfra').emit('shareTrack', data)
  })
  socket.on('set_name', function (data) {
    fs.readdir(path.join(__dirname, '/../public/downloads'), (err, files) => {
      if (err) {
        logger.log(err)
      } else {
        // logger.log('readdir files list = ' + files)
        // socket.emit('files_data', files)

        console.log('Files ', typeof files)
        socket.emit('files', files)
        files.forEach(file => {

          // logger.log('file = ' + file )
        })
      }
    })
    socket.nickname = data.name
    socket.color = data.color
    logger.log(data)
    logger.log(socket.nickname)
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
    socket.on('disconnect', () => {
      delete myClients[socket.id]
      chatInfra.emit('userLeft', socket.id)
      logger.log(socket.nickname, socket.id, ' has left')
    })
  })
  socket.on('getsong', require('./youtube.js'))
})
io.of('/chat_com').on('connection', function (socket) {
  // logger.log(socket)
  // playing
  socket.on('playing', (data) => {
    // logger.log(socket)
    // data.type = 'serverMessage',
    // logger.log(data)

    logger.log(data.name, '  is playing!!!')
    // logger.log('data == ', data);

    // socket.broadcast.emit('play')
    chatInfra.emit('play', data)
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

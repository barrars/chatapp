const chalk = require('chalk');
var exec = require('child_process').exec
var fs = require('fs');
var colors = require('colors');
var logger = require('tracer').colorConsole({
  format: "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L",
  filters: {
    log: [colors.underline, colors.white],
    trace: colors.magenta,
    debug: colors.blue,
    info: colors.green,
    warn: colors.yellow,
    error: [colors.red, colors.bold]
  }
})
var io = require('socket.io')();

// var io = null;


var youtube = require('./myMod')


const myClients = {}

exports.io = function () {
    return io
  };
  

  var chatInfra = io.of("/chat_infra")
    .on("connection", function (socket) {

      socket.on('getList', () => {
      })
      socket.on('songClick', (data) => {
        console.log('alyica needs to focus!!!!!', data);
        socket.broadcast.emit('shareTrack', data)
      })
      socket.on("set_name", function (data) {
        fs.readdir(__dirname + '/../public/downloads', (err, files) => {
          if (err) {
            logger.log(err)
          } else {
            // logger.log('readdir files list = ' + files)
            // socket.emit('files_data', files)

            console.log('Files ', typeof files);
            socket.emit('files', files)
            files.forEach(file => {

              // logger.log('file = ' + file )
            });
          }
        })
        socket.nickname = data.name
        logger.log('nickname= ', socket.nickname)
        myClients[socket.id] = socket.nickname
        logger.log(myClients)
        socket.emit('list', myClients)
        // logger.log('nick ', socket.nickname);

        socket.emit('name_set', data);
        socket.send(JSON.stringify({

          type: 'serverMessage',
          message: 'Welcome to the most interesting ' +
            'chat room on earth!'
        }));
        socket.broadcast.emit('user_entered', data);
        socket.on('disconnect', () => {
          logger.log(socket.nickname, ' has left')
        })

      });
      socket.on('getsong', require('./myMod.js'))

       


    });
  var chatCom = io.of("/chat_com")
    .on("connection", function (socket) {
      logger.log(socket.nickname)
      // logger.log(socket)
      //playing

      socket.on('playing', (data) => {
        logger.log(data);

        logger.log(data, '  is playing!!!');
        // logger.log('data == ', data);

        // socket.broadcast.emit('play')
        chatCom.emit('play')
      })
      socket.on('message', function (message) {
        message = JSON.parse(message);


        if (message.type == "userMessage") {

          socket.nickname = message.username
          logger.log(message, socket.id);
          socket.broadcast.send(JSON.stringify(message));
          message.type = "myMessage";
          socket.send(JSON.stringify(message));

        }
      });
    });




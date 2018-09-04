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
var io = require('socket.io');


//ytdl

//get the files list



const myClients = {}
exports.initialize = function (server) {
  io = io.listen(server);
  var chatInfra = io.of("/chat_infra")
    .on("connection", function (socket) {
      socket.on('getList', ()=>{
      })
      socket.on('songClick', (data)=>{
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
             
            console.log('Files ' , typeof files);
            socket.emit('files', files)
            files.forEach(file => {
        
              // logger.log('file = ' + file )
            });
          }
        })
        socket.nickname = data.name
        logger.log(socket.nickname)
        myClients[socket.id]=socket.nickname
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

      });
      socket.on('getsong', (data) => {
        console.log('dirname = ' , __dirname);
        
        // socket.emit('test_1', data);
        logger.log(chalk.yellowBright('server received getsong event from client  ' + data));
        // if (!song) {
        //   logger.log('you didnt enter a url');
        //   // socket.emit('done', undefined)
        //   logger.log('getsong socket event ' + song.link)
        //   // return
        // } else{
    
        logger.log('else getsong socket event*** ' + data)
        // var convert_mp3 = song.convert;
        // song = song.link
        // var youtubedl = exec('ls -al', ()=>{
        var youtubedl = exec('youtube-dl --config-location . ' + data, ()=>{
          console.log('##### ' , __dirname);
          
        })
        youtubedl.stdout.on('data', function (stdout) {
          var stdout = stdout.trim()
          logger.log(chalk.blueBright('stdout = ') + stdout)
          if (stdout.toLocaleLowerCase().indexOf('destination') > 0) {
            logger.log('stdout.slice = ' + stdout.slice(41))
            var name = logger.log(stdout.slice(41))
            var songInfo = {
              name
            }
            // logger.log('name = ' + chalk.blueBright(stdout.slice(41)).);
            socket.emit('name', songInfo)
            console.log('omg!' , songInfo);
            
    
          }
          // var d = c.match(/([a-z].*)(?=\.[A-z])/gim)
    
    
          // var stdout = stdout.split('\n')
          // var stdout = stdout[0].split(' ')
          if (stdout.startsWith('[download]')) {
            // var songName = stdout.substring(43, (stdout.length - 4))
            logger.log('downloading');
            logger.log(chalk.blueBright('stdout = ') + stdout)
            var splitOut = stdout.split(' ')
            // logger.log(splitOut);
    
            var percent 
            // var total
            if (splitOut[2].indexOf('of') !== -1) {
              percent = splitOut[1]
              logger.log('percent is a ' + typeof percent)
              // total = splitOut[3]
            } else {
              percent = splitOut[2]
              var total_size = splitOut[4]
            }
            var download_data = {
              percent,total_size
            }
    
            logger.log(chalk.blueBright('percent = ') + percent)
            socket.emit('download_data', download_data)
            if (stdout.toLocaleLowerCase().indexOf('already') > 0) {
              socket.emit('already', data)
            }
          
    
            if (stdout.toLocaleLowerCase().indexOf('100') > 0) {
    
              socket.emit('done', data)
              logger.log(chalk.green('we done at 100%%%%%%%%', data))
            }
          }
    
        })
      })
    
    });
  var chatCom = io.of("/chat_com")
    .on("connection", function (socket) {
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
        logger.log(message);

        if (message.type == "userMessage") {

          socket.nickname = message.username
          socket.broadcast.send(JSON.stringify(message));
          message.type = "myMessage";
          socket.send(JSON.stringify(message));

        }
      });
    });
}


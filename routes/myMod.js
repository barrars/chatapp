
// module.exports = (greet) =>{
    //     console.log(greet);
    
    // };
    
    // mine('hello')
    //  hi = console.log(x=1, ++x);
    var exec = require('child_process').exec
    var colors = require('colors');
    const chalk = require('chalk');
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
    
    module.exports = function (data) {
        var io = require('../routes/sockets').io()
        // var socket = require('./sockets.js').io()
        
        
        console.log('dirname = ', __dirname);
        
        logger.log(chalk.yellowBright('server received getsong event from client  ' + data));
        
        
        logger.log('else getsong socket event*** ' + data)
        
        var youtubedl = exec('youtube-dl --config-location . ' + data, () => {
            console.log('##### ', __dirname);

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
            io.emit('name', songInfo)
            console.log('omg!', songInfo);

            
        }
        
        
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
                percent, total_size
            }
            
            logger.log(chalk.blueBright('percent = ') + percent)
            io.emit('download_data', download_data)
            if (stdout.toLocaleLowerCase().indexOf('already') > 0) {
              io.emit('already', data)
            }
            
            
            if (stdout.toLocaleLowerCase().indexOf('100') > 0) {
                
                io.emit('done', data)
                logger.log(chalk.green('we done at 100%%%%%%%%', data))
            }
        }

    })
}
    
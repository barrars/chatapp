
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

var io = require('../routes/sockets').io()
module.exports = function (data) {
    // var songTitle
    //gives the client
    logger.log(chalk.yellowBright('server received getsong event from' + data));
    logger.log('else getsong socket event*** ' + data)
    const youtubedl = exec(`youtube-dl "ytsearch:${data}" --config-location . `, (error) => {
        // logger.log('##### ', __dirname);
        if (!error === null) {
            
            logger.log(error);
            io.emit('error')
        }

    })

    youtubedl.on('close', (code) => {
        logger.log(code)
        if (code === 1) {
            io.emit('error')
        }
    })

    youtubedl.stderr.on('data', (data) => {
        logger.log(`stderr: ${data}`);
      });
    
    //         if (error === null) {
    //             logger.log(`exec error: ${error}`)
    //             io.emit('title', songTitle)
    //             logger.log(songTitle)
    //             return
    //         }
            // if (!error===null) {
            //     logger.log(`exec error: ${error}`)
            //     io.emit('title' , error)
                
            // }

  youtubedl.stdout.on('data', function (stdout) {
        logger.log('STDOUT = ', stdout);
        // var songTitle      
        if (stdout.toLocaleLowerCase().indexOf('%') > 0) {
            var percent = stdout.match(/(\d+).\d\%/g)[0]
            io.emit('percent', percent)
        }
        // if (stdout.toLocaleLowerCase().indexOf('download') > 0) {
            // logger.log(songTitle)
            // logger.log(songTitle.toLocaleLowerCase().indexOf('mp3'))
            if (stdout.toLocaleLowerCase().indexOf('mp3') > 0) {
                
                logger.log(stdout.toLocaleLowerCase().indexOf('mp3'))
                logger.log(chalk.blueBright('stdout length = ') + stdout.length)
                // logger.log(songTitle)
                youtubedl.on('close', (code) => {
                    logger.log(code)
                    title = stdout.slice(41)
                    logger.log(`child process exited with code ${code}`);
                    logger.log(title)
                    io.emit('title', title)
                  return title
                });
                // return songTitle
            }
        // }
    })



}

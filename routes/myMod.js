
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

var io = require('../routes/sockets').io()
module.exports = function (data) {
    // var socket = require('./sockets.js').io()


    // console.log('dirname = ', __dirname);

    // logger.log(chalk.yellowBright('server received getsong event from client  ' + data));


    // logger.log('else getsong socket event*** ' + data)

    var youtubedl = exec('youtube-dl --config-location . ' + data, () => {
        // console.log('##### ', __dirname);

    })
    youtubedl.stdout.on('data', function (stdout) {
        var songTitle
        var stdout = stdout.trim()
        
        if (stdout.toLocaleLowerCase().indexOf('download') > 0) {
            // logger.log('stdout.slice = ' + stdout.slice(41))
            songTitle = stdout.slice(41)
            if (songTitle.toLocaleLowerCase().indexOf('mp3')>0) {
                console.log('index of mp3');
                console.log(
                    songTitle.toLocaleLowerCase().indexOf('mp3')

                );
                
                
                logger.log(chalk.blueBright('stdout = ') + stdout.length)
                     io.emit('title', songTitle)
                     logger.log(songTitle)
                     
                 }
                return songTitle
                
            }
            
        

            logger.log('@@@@@@ ', songTitle);
            
        



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

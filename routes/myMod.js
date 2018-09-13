
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
    //gives the client
    logger.log(chalk.yellowBright('server received getsong event from' + data));
    logger.log('else getsong socket event*** ' + data)
    var youtubedl = exec(`youtube-dl "ytsearch:${data}" --config-location . `, (error) => {
        logger.log('##### ', __dirname);
        logger.log(error);
        if (error) {
            logger.log(`exec error: ${error}`)
            io.emit('error')

        }
        if (error === null) {
            logger.log(`exec error: ${error}`)
        }
    })

    youtubedl.stderr.on('data', function (stderr) {
        logger.log(stderr)
})

    youtubedl.stdout.on('data', function (stdout) {
        logger.log('STDOUT = ', stdout);
        var songTitle      
        if (stdout.toLocaleLowerCase().indexOf('%') > 0) {
            var percent = stdout.match(/(\d+).\d\%/g)[0]
            io.emit('percent', percent)
        }
        if (stdout.toLocaleLowerCase().indexOf('download') > 0) {
            songTitle = stdout.slice(41)
            logger.log(songTitle)
            logger.log(songTitle.toLocaleLowerCase().indexOf('mp3'))
            if (songTitle.toLocaleLowerCase().indexOf('mp3') > 0) {
                logger.log(songTitle.toLocaleLowerCase().indexOf('mp3'))
                logger.log(chalk.blueBright('stdout length = ') + stdout.length)
                io.emit('title', songTitle)
                logger.log(songTitle)
                return
            }
            return songTitle
        }
    })
}

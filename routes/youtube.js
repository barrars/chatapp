var exec = require("child_process").exec;
var colors = require("colors");
const chalk = require("chalk");
const rename = require('./rename')
var logger = require("tracer").colorConsole({
  format:
    "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L",
  filters: {
    log: [colors.underline, colors.white],
    trace: colors.magenta,
    debug: colors.blue,
    info: colors.green,
    warn: colors.yellow,
    error: [colors.red, colors.bold]
  }
});

var io = require("./sockets").io();
module.exports = function(data) {
  logger.log(chalk.yellowBright("server received getsong event from" + data));
  logger.log("else getsong socket event*** " + data);
  const youtubedl = exec(
    `youtube-dl "ytsearch:${data}" --config-location . `,
    error => {
      if (!error === null) {
        logger.log(error);
        io.emit("error");
      }
    }
  );

  youtubedl.on("close", code => {
    logger.log(code);
    if (code === 1) {
      io.emit("error");
    }
  });

  youtubedl.stderr.on("data", data => {
    logger.log(`stderr: ${data}`);
  });

  youtubedl.stdout.on("data", function(stdout) {
    logger.log("STDOUT = ", stdout);
    if (stdout.toLocaleLowerCase().indexOf("%") > 0) {
      var percent = stdout.match(/(\d+).\d\%/g)[0];
      io.emit("percent", percent);
    }
    if (stdout.toLocaleLowerCase().indexOf("mp3") > 0) {
      logger.log(stdout.toLocaleLowerCase().indexOf("mp3"));
      logger.log(chalk.blueBright("stdout length = ") + stdout.length);
      youtubedl.on("close", code => {
        logger.log(code);
        title = stdout.slice(41);
        logger.log(`child process exited with code ${code}`);
        logger.log(title);
        rename( __dirname +'/../public/downloads/', '.mp3', '')
        io.emit("title", title);
        return title;
      });
    }
  });
};

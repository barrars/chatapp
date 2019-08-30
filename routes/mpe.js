const logger = require("./myLogger");
// logger.trace(new Date())

const fs = require("fs-extra");
fs.readdir("public/downloads", (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    if (file.indexOf(".mp3") > 0) {
      fs.rename(
        "public/downloads/" + file,
        "public/downloads/" + file.slice(0, file.indexOf(".mp3")),
        err => {
          if (err) {
            logger.log(err);
          }
          logger.log("done");
        }
      );
      logger.log(file.slice(0, file.indexOf(".mp3")));
    }
  });
});

var gulp = require("gulp");
var pug = require("gulp-pug");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var prettyCSS = require('postcss-prettify')


gulp.task("pug", function() {
  return gulp
    .src("pug/*.pug")
    .pipe(
      pug({
        doctype: "html",
        pretty: false
      })
    )
    .pipe(gulp.dest("./build"))
    .pipe(reload({ stream: true }));
});

gulp.task(
  "serve",
  gulp.series("pug", function() {
    browserSync({
      server: {
        baseDir: "build",
        directory: true
      }
    });
    gulp.watch("pug/*", gulp.series("pug"));
    gulp.watch("public/stylesheets/*", gulp.series("css"));
  })
);
/*  */
gulp.task("css", function() {
  var plugins = [
    autoprefixer({browsers: ["last 1 version"] }), 
    cssnano({
      preset: 'default',
    })];
  return gulp
    .src("./public/stylesheets/*.css")
    .pipe(postcss(plugins))
    .pipe(gulp.dest("./build/stylesheets"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});
/*  */
/*  */

var gulp = require('gulp')
var pug = require('gulp-pug')
var browserSync = require('browser-sync')
var reload = browserSync.reload
var postcss = require('gulp-postcss')
var autoprefixer = require('autoprefixer')
var cssnano = require('cssnano')
var prettyCSS = require('postcss-prettify')
var concat = require('gulp-concat')

gulp.task('pug', function () {
  return gulp.src('views/index.jade').pipe(
    pug({
      doctype: 'html',
      filename: 'jade',
      basedir: 'views',
      pretty: true
    })
  )
    .pipe(gulp.dest('./public/build'))
    .pipe(reload({ stream: true }))
})

gulp.task('serve', gulp.series('pug', function () {
  browserSync({
    server: {
      baseDir: 'build',
      directory: true
    }
  })
  gulp.watch('pug/*', gulp.series('pug'))
  gulp.watch('public/stylesheets/*', gulp.series('css'))
})
)
/*  */
gulp.task('css', function () {
  var plugins = [
    autoprefixer({ browsers: ['last 1 version'] }),
    cssnano({ preset: 'advanced' })
  ]
  return gulp
    .src('./public/build/stylesheets/*.css')
    .pipe(postcss(plugins))
    .pipe(concat('build.css'))
    .pipe(gulp.dest('./public/build/stylesheets'))
    .pipe(
      browserSync.reload({
        stream: true
      })
    )
})

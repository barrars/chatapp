const logger = require('./myLogger')
// logger.trace(new Date())

const get = require('simple-get')
// logger.log(process.argv[2])
// get('https://itunes.apple.com/search?term=lizzo', function (err, res) {
function msToTime (s) {
  var ms = s % 1000
  s = (s - ms) / 1000
  var secs = s % 60
  s = (s - secs) / 60
  var mins = s % 60
  var hrs = (s - mins) / 60

  return hrs + ':' + mins + ':' + secs
}
// var regexConst = /.*(source)/g

// const term = escape(process.argv[2])
// logger.log(process.argv[2])

// logger.log(term)

// const term = escape('A$AP TWELVYY - CHILDS PLAY')
module.exports.search = term => {
  const opts = {
    method: 'POST',
    url: 'https://itunes.apple.com/search?term=' + term,
    body: {
      key: 'value'
    },
    json: true
  }
  get.concat(opts, function (err, res, data) {
    if (err) throw err
    logger.log(Object.keys(data))
    logger.log(data.resultCount)

    data.results.forEach((element, i) => {
      if (i < 5) {
        logger.log(`Artist = ${element.artistName}`)
        logger.log(`Track = ${element.trackName}`)
        logger.log(`Album = ${element.collectionName}`)
        logger.log(`sample = ${element.previewUrl}`)
        logger.log(
          `Thumbnail = ${element.artworkUrl100}`.match(/.*(source)/g) +
            '/512x512bb.jpg'
        )
        logger.log(`Runtime = ${msToTime(element.trackTimeMillis)}`)
        logger.log('__________________________________')
      } else {
      }
    })
  })
}

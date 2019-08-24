const logger = require('./myLogger')
logger.trace(new Date())

const get = require('simple-get')
// console.log(process.argv[2])
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
// console.log(process.argv[2])

// console.log(term)

// const term = escape('A$AP TWELVYY - CHILDS PLAY')
module.exports.search = (term) => {
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
    console.log(Object.keys(data))
    console.log(data['resultCount'])

    data['results'].forEach((element, i) => {
      if (i < 5) {
        console.log(`Artist = ${element.artistName}`)
        console.log(`Track = ${element.trackName}`)
        console.log(`Album = ${element.collectionName}`)
        console.log(`sample = ${element.previewUrl}`)
        console.log(`Thumbnail = ${element.artworkUrl100}`.match(/.*(source)/g) + '/512x512bb.jpg')
        console.log(`Runtime = ${msToTime(element.trackTimeMillis)}`)
        console.log('__________________________________')
      } else {

      }
    })
  })
}

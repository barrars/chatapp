const ipRegex = require('ip-regex')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const logger = require('./myLogger')

const uniqeVisits = () => {
  fs.readFile(path.join(__dirname, './../ip.log'), 'utf-8', (err, data) => {
    if (err) {
      console.log(err)
    }
    // console.log(data)

    logger.log(`# of uniqve IP addresses ${_.uniq(data.match(ipRegex())).length}`)
    let abc = _.uniq(data.match(ipRegex())).length
    return abc
  })
}

module.exports = {
  uniqeVisits
}

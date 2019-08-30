const logger = require('./myLogger')
// logger.trace(new Date())
const ipRegex = require('ip-regex')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')

const uniqeVisits = () => {
  fs.readFile(path.join(__dirname, './../ip.log'), 'utf-8', (err, data) => {
    if (err) {
      logger.log(err)
    }
    // logger.log(data)

    // logger.log(`# of uniqve IP addresses ${_.uniq(data.match(ipRegex())).length}`)
    const abc = _.uniq(data.match(ipRegex())).length
    return abc
  })
};

module.exports = {
  uniqeVisits
}

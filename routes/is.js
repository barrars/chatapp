const ipRegex = require('ip-regex')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const uniqeVisits = () => {
  fs.readFile(path.join(__dirname, './../ip.log'), 'utf-8', (err, data) => {
    console.log(err)
    console.log(`# of uniqve IP affresses ${_.uniq(data.match(ipRegex())).length}`)
    let abc = _.uniq(data.match(ipRegex())).length
    return abc
  })
}

module.exports = {
  uniqeVisits
}

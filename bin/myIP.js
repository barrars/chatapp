const logger = require('../routes/myLogger')
var os = require('os')
var ifaces = os.networkInterfaces()
module.exports = Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0
  ifaces[ifname].forEach(function (iface) {
    if (iface.family !== 'IPv4' || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return
    }
    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      logger.log(ifname + ':' + alias, iface.address)
    } else {
      // logger.log(ifname + ':' + alias, iface.address)
      // logger.log(`alias = ${alias}`)
      // this interface has only one ipv4 adress
      logger.log('external address http://' + iface.address + ':3001')
      logger.log('internal address = http://localhost:3001/')
    }
    ++alias
  })
})

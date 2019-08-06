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
      // console.log(`alias = ${alias}`)

      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address)
    } else {
      // console.log(`alias = ${alias}`)
      // this interface has only one ipv4 adress
      console.log('external address ', iface.address)
    }
    ++alias
  })
})

// console.log(`my logger.js ${new Date()}`)

var colors = require('colors')
const logger = require('tracer').colorConsole({
  format: '{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})',
  dateformat: 'HH:MM:ss.L'
})
module.exports = logger
logger.trace(new Date())

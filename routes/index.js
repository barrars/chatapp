const logger = require('./myLogger')
logger.trace(new Date())
const express = require('express')
const router = express.Router()
const fs = require('fs-extra')
const cache = require('./cache').cacheSongs
router.get('/', function (req, res) {
  console.time()
  cache(data => {
    res.render('index', { title: 'Chat Radio', songs: data })
  })
  console.timeEnd()

  fs.appendFile('ip.log', `${req.ip} connected at ${Date()} \n`, (err) => {
    if (err) {
      logger.log('err'.red)
      logger.log(err)
    }
  })
})

module.exports = router

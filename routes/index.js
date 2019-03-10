var express = require('express')
var router = express.Router()
const fs = require('fs-extra')
/* GET home page. */
router.get('/', function (req, res, next) {
  // logger.log('test seession'.green)
  // logger.log(req.session)
  let count = req.session.count
  if (!count) {
    req.session.count = 1
  } else {
    req.session.count++
  }

  res.render('index', { title: 'Chat Radio' })

  fs.appendFile('ip.log', `${req.ip} connected at ${Date()} \n`, (err) => {
    if (err) {
      // logger.log('err'.red)
      // logger.log(err)
    }
  })
  // logger.log(req.ip)
})

module.exports = router

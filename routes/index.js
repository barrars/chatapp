var express = require('express')
var router = express.Router()
const fs = require('fs')
/* GET home page. */
router.get('/', function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  res.render('index', { title: 'Chat Radio' })

  fs.appendFile('ip.log', `${req.ip} connected at ${Date()} \n` )
  console.log(req.ip)
})

module.exports = router

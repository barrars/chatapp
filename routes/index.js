var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  res.render('index', { title: 'Chat Radio' })
  console.log(req.ip)
})

module.exports = router

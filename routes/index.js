var express = require('express')
var router = express.Router()
const fs = require('fs')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Chat Radio' })

  fs.appendFile('ip.log', `${req.ip} connected at ${Date()} `, (err) => {
    console.log(err)
  })
  console.log(req.ip)
})

module.exports = router

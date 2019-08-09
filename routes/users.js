var express = require('express')
var router = express.Router()
const logger = require('./myLogger')

/* GET users listing. */
router.get('/set_name/:name', function (req, res, next) {
  logger.log('set_name/:name'.blue)
  logger.log(req.body)
  logger.log(req.params)
  let name = req.params.name
  req.session.name = name

  res.send('respond with a resource')
})

router.get('/is_name_set', (req, res) => {
  logger.log('is name set?'.green)
  // logger.log(req.session)
  if (req.session.name) {
    res.send(req.session.name)
  } else {
    res.send(false)
  }
})

module.exports = router

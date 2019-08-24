const logger = require('./myLogger')
logger.trace(new Date())

const express = require('express')
const router = express.Router()
// const logger = require('./myLogger')

/* GET users listing. */
router.get('/set_name/:name', function (req, res, next) {
  logger.log('set_name/:name'.blue)
  logger.log(req.body)
  logger.log(req.params)
  let name = req.params.name
  req.session.name = name
  res.send(name)
})

router.get('/is_name_set', (req, res) => {
  logger.log('received get for /is_name_set'.green)
  logger.log(req.session.name)
  // logger.log(req.session)
  if (req.session.name !== 'undefined') {
    logger.log(req.session.name)

    res.send(req.session.name)
  } else {
    res.send(false)
  }
})

module.exports = router

const logger = require('./myLogger')
logger.trace(new Date())
const express = require('express')
const router = express.Router()
router.get('/:song', function (req, res) {
  logger.log(req.params)
  res.render('playerView', { song: req.params.song })
})

module.exports = router

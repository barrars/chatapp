const logger = require('./myLogger')
logger.trace(new Date())
const express = require('express')
const router = express.Router()
router.get('/:song', function (req, res) {
  logger.log(req.params)
  if (req.params.song) {
    logger.log(req.params.song)

    res.render('playerView', { song: req.params.song })
  }
})
router.get('/', function (req, res) {
  res.redirect('/')
  res.render('index', { title: 'Chat Radio', songs: data })
})

module.exports = router

// eslint-disable-next-line no-unused-vars
const logger = require('./myLogger')
// logger.trace(new Date())
const songs = require('../models/songs')
const express = require('express')
const router = express.Router()
router.get('/:song', async function (req, res) {
  // logger.log(req.params)
  const song = await songs.find({ fileSlug: req.params.song })
  console.log(song)
  res.render('playerView', { song })
})
router.get('/', function (req, res) {
  res.redirect('/')
  // res.render('index', { title: 'Chat Radio', songs: data })
})

module.exports = router

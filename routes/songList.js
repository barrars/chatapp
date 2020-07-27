// router for /songlist
const logger = require('./myLogger')
// logger.trace(new Date())
const songs = require('../models/songs')
const express = require('express')
const router = express.Router()
router.get('/', async function (req, res) {
  logger.log('hit songList API route ')
  const songList = await songs.find({})
  if (songList) {
    console.log('got JSON')
    res.json(songList)
  } else {
    res.json({ err: 'something isnt right' })
  }
})

module.exports = router

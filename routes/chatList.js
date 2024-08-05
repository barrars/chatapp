// router for /chatList
const logger = require('./myLogger')
// logger.trace(new Date())
const chats = require('../models/chatModel')
const express = require('express')
const router = express.Router()
router.get('/', async function (req, res) {
  logger.log('hit songList API route ')
  const chatList = await chats.find({})
  if (chatList) {
    logger.log('got JSON')
    res.json(chatList)
  } else {
    res.json({ err: 'something isnt right' })
  }
})

module.exports = router

const logger = require('./myLogger')
// logger.trace(new Date())
const express = require('express')
const router = express.Router()
const fs = require('fs-extra')
// const cache = require('./cache').cacheSongs
const chatLog = require('../models/chatModel')

const songs = require('../models/songs')
router.get('/', function (req, res) {
  songs.find({}).then(tracks => {
    // logger.log(tracks)

    chatLog.find({}).then(chats => {
      res.render('index', { title: 'Chat Radio', songs: tracks, chats: chats })
    })
  })

  // cache(songs => {
  // })

  fs.appendFile('ip.log', `${req.ip} connected at ${Date()} \n`, err => {
    if (err) {
      logger.log('err'.red)
      logger.log(err)
    }
  })
})

module.exports = router

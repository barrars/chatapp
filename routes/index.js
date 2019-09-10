const logger = require('./myLogger')
// logger.trace(new Date())
const express = require('express')
const router = express.Router()
const fs = require('fs-extra')
const cache = require('./cache').cacheSongs
const chatLog = require('../models/chatModel')
chatLog.find({}).then(result => {
  logger.log(`${result.length} chats saved in the db`)
})

router.get('/', function (req, res) {
  cache(songs => {
    chatLog.find({}).then(chats => {
      res.render('index', { title: 'Chat Radio', songs: songs, chats: chats })
    })
  })

  fs.appendFile('ip.log', `${req.ip} connected at ${Date()} \n`, err => {
    if (err) {
      logger.log('err'.red)
      logger.log(err)
    }
  })
})

module.exports = router

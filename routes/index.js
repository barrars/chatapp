const logger = require('./myLogger')
const express = require('express')
const router = express.Router()
const fs = require('fs-extra')
const chatLog = require('../models/chatModel')
const songModel = require('../models/songs')

router.get('/', async function (req, res) {
  const [songs, chats, names] = await
  Promise.all([
    songModel.find(),
    chatLog.find(),
    chatLog.find().distinct('name')
  ])
  res.render('index', {
    names,
    songs,
    title: 'ChatRadio',
    chats

  })

  // const tracks = await songs.find()
  // const players = await songs.find().distinct('createdBy')
  // logger.log(players)

  // const chats = await chatLog.find()
  // const names = await chatLog.find().distinct('name')
  // res.render('index',
  //   {
  //     names: names,
  //     title: 'Chat Radio',
  //     songs: tracks,
  //     chats: chats
  //   })

  fs.appendFile('ip.log', `${req.ip} connected at ${Date()} \n`, err => {
    if (err) {
      logger.log('err'.red)
      logger.log(err)
    }
  })
})

module.exports = router

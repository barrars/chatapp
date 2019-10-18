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

  router.get('/pdf/:file', (req, res) => {
    logger.log(req.ip)
    logger.log(req.ips)

    // console.log(req.param('file'))
    console.log(req.params.file)
    // res.end('hello')
    var tempFile = `./pdfs/${req.params.file}`

    fs.readFile(tempFile, function (err, data) {
      if (err) {
        console.error(err)
      }
      res.contentType('application/pdf')
      res.send(data)
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

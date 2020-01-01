const logger = require('./myLogger')
const express = require('express')
const router = express.Router()
const fs = require('fs-extra')
const chatLog = require('../models/chatModel')
const songModel = require('../models/songs')
const { join } = require('path')
const mime = require('mime')
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

  // router.get('/pdf/:file', (req, res) => {
  //   logger.log(req.ip)
  //   logger.log(req.ips)

  //   // logger.log(req.param('file'))
  //   console.log(req.params.file)
  //   // res.end('hello')
  //   var tempFile = `./pdfs/${req.params.file}`

  //   fs.readFile(tempFile, function (err, data) {
  //     if (err) {
  //       console.error(err)
  //     }
  //     res.contentType('application/pdf')
  //     res.send(data)
  //   })
  // })

  fs.appendFile('ip.log', `${req.ip} connected at ${Date()} \n`, err => {
    if (err) {
      logger.log('err'.red)
      logger.log(err)
    }
  })
})
router.get('/download/:name', (req, res) => {
  logger.log(__dirname)
  const song = join(__dirname, '../public/downloads/', `${req.params.name}`)
  // const song = `../public/downloads/${req.params.name}`

  fs.readFile(song, (err, file) => {
    if (err) {
      logger.error(err)
      return res.send('file not found')
    }
    if (file) {
      // consol/se.log(file)

      // const mimetype = mime.lookup(file)
      // res.setHeader('Conent-disposition', 'attachment; filename=' + req.params.name + '.mp3')
      // res.setHeader('Content-type', mimetype)
      // const fileStream = fs.createReadStream(file)
      // fileStream.pipe(res)
      logger.log(song)
      // res.sendFile(req.params.name, { root: join(__dirname, '../public/downloads/') })
      res.sendFile(song, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': 'filename= "music.mp3"'

        }
      })
    }
  })
})

module.exports = router

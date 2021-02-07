const express = require('express')
const router = express.Router()
const songModel = require('../models/songs')
// const mime = require('mime')
router.get('/', async function (req, res) {
  const songs = await songModel.find()

  res.render('deleted', {
    songs,
    title: 'ChatRadio'

  })
})

module.exports = router

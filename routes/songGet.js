// router for /songGet
const logger = require('./myLogger')
// logger.trace(new Date())
const songs = require('../models/songs')
const express = require('express')
const router = express.Router()
router.get('/:id', function (req, res) {
  const id = req.params.id
  logger.log('get id', id)
  songs.find({ _id: id })
    .then(doc => res.json(doc))

    .catch(err => res.json({ err }))
})

module.exports = router

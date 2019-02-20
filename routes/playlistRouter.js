var express = require('express')
var router = express.Router()
const playlist_model = require('../models/playlist_model.js')

/* GET users listing. */
router.post('/create/', async function (req, res, next) {
  try {
    logger.log('Create Playlist Route'.green)
    let playlist_name = req.body.playlist_name
    let created_by = req.session.id
    logger.log({ playlist_name, created_by })
    let saved_playlist = await playlist_model.create_new_playlist({ playlist_name, created_by })

    logger.log(saved_playlist)
    res.send('saved_playlist')
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send('error')
  }
})

router.get('/', async function (req, res, next) {
  try {
    logger.log('Get all playlists'.green)
    // let created_by = req.session.id
    let all_playlist = await playlist_model.get_all_playlists()
    logger.log({ all_playlist })

    res.send(all_playlist)
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send('error')
  }
})

router.get('/my_playlists', async function (req, res, next) {
  try {
    logger.log('Get my playlists'.green)
    // let created_by = req.session.id
    let my_playlist = await playlist_model.get_my_playlists(req)
    logger.log({ my_playlist })

    res.send(my_playlist)
  } catch (err) {
    logger.log('err'.bgRed)
    logger.log(err)
    res.send('error')
  }
})

module.exports = router

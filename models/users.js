const mongoose = require('mongoose')
const logger = require('../routes/myLogger')
const Schema = mongoose.Schema
const date = new Date()

const userSchema = new Schema({
  name: { type: String, unique: true },
  color: { type: String },
  created: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  favorites: Array
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
})
userSchema.virtual('playlist',
  {
    ref: 'songs',
    localField: 'favorites',
    foreignField: 'fileSlug'

  })
const Users = module.exports = mongoose.model('user', userSchema)
const playlistGet = data => {
  Users.findOneAndUpdate({ name: data.myId }, {
    $addToSet: { favorites: data.slug ? data.slug : null }
  }, { new: true })
    .populate('playlist')
    .exec(function (err, songs) {
      if (err) {
        logger.error(err)
      }
      // logger.log(songs)
      return songs
    })
}
function createUser (user) {
  logger.log(user)
  Users.findOneAndUpdate(user, { lastLogin: date.toDateString() }, { upsert: true, new: true })
    .then(doc => {
      // logger.log({ doc })
      doc.save()
    })
    .catch(err => logger.error(err))
}

Users.create = createUser
Users.playlist = playlistGet

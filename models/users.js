const mongoose = require('mongoose')
const logger = require('../routes/myLogger')
const Schema = mongoose.Schema
const date = new Date()

const userSchema = new Schema({
  name: { type: String, unique: true },
  color: { type: String },
  created: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
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
const playlistGet = async data => {
  // logger.log(data)
  const songs = await Users.findOne({ name: data.name }, {}, { lean: true })

    .populate('playlist')
  return songs
}
function createUser (user) {
  logger.log(user)
  Users.findOneAndUpdate(user, { lastLogin: date.toISOString() }, { upsert: true, new: true })
    .then(doc => {
      doc.save()
      return doc
    })
    .catch(err => logger.error(err))
}

const Users = module.exports = mongoose.model('user', userSchema)
Users.createUser = createUser
Users.playlist = playlistGet

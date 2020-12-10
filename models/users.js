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
const playlistGet = async data => {
  logger.log(data)
  const songs = await Users.findOne({ name: data.name }, {}, { lean: true })

    .populate('playlist')
  return songs
}
function createUser (user) {
  Users.findOneAndUpdate(user, { lastLogin: date.toDateString() }, { upsert: true, new: true })
    .then(doc => {
      doc.save()
      return doc
    })
    .catch(err => logger.error(err))
}

Users.createUser = createUser
Users.playlist = playlistGet

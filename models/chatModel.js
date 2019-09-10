const mongoose = require('mongoose')
// const logger = require('../routes/myLogger')
const Schema = mongoose.Schema

const chatSchema = new Schema({
  message: { type: String },
  name: { type: String },
  color: { type: String },
  timestamp: { type: Date, default: Date.now }
})
const Chats = module.exports = mongoose.model('chat', chatSchema)

async function create (chat) {
  const newChat = new Chats(chat)
  if (!newChat.save()) {
    throw new Error()
  }
  // return newChat
}

Chats.create = create
// module.exports = mongoose.model('chat', chatSchema)

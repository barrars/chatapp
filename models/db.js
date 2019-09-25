require('dotenv').config()
const logger = require('../routes/myLogger')
const mongoose = require('mongoose')
const dbURI = process.env.MONGO_URL

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(error => {
    logger.log(error.message)
  })
// prevents a deprecation warning
mongoose.set('useCreateIndex', true)

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  logger.log('Mongoose default connection open to ' + dbURI)
})

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  logger.log('Mongoose default connection error: ' + err)
})

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  logger.log('Mongoose default connection disconnected')
})

// If the Node process ends, close the Mongoose connection
// process.on('SIGINT', function () {
//   mongoose.connection.close(function () {
//     logger.log('Mongoose default connection disconnected through app termination')
//     process.exit(0)
//   })
// })

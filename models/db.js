require('dotenv').config()
const logger = require('../routes/myLogger')
// logger.trace(new Date())
const mongoose = require('mongoose')
const db_uri = process.env.MONGO_URL

mongoose.connect(db_uri, { useNewUrlParser: true })
  .catch(error => {
    logger.log(error.message)
  })
// prevents a deprecation warning
mongoose.set('useCreateIndex', true)

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  logger.log('Mongoose default connection open to ' + db_uri)
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
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    logger.log('Mongoose default connection disconnected through app termination')
    process.exit(0)
  })
})

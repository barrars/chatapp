// GLOBALS

require('dotenv').config()

// colors = require('colors')
// logger = require('tracer').colorConsole({
//   format: '{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})',
//   dateformat: 'HH:MM:ss.L'
// })
// GLOBALS

require('./models/db.js')
// const logger = require('./routes/myLogger')
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const playlistRouter = require('./routes/playlistRouter')
// const chalk = require('chalk')

const session = require('express-session')
// const mongoose = require('mongoose')
const mongoStore = require('connect-mongo')(session)
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.enable('trust proxy')
// app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// SESSION OPTIONS
const mongo_store = new mongoStore({ url: process.env.MONGO_URL })
const sessionOptions = {
  store: mongo_store,
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
  cookie: {
    //   secure: false,//this is the default setting
    httpOnly: false // this is on by default
    // expires: new Date(2400000000000000) // last loooong time
  }
}

const sessionMiddleware = session(sessionOptions)
app.use(sessionMiddleware)

app.use('/', indexRouter)
app.use(express.static(path.join(__dirname, 'public')))
app.use('/public', express.static(path.join(__dirname, '/public')))

app.use('/users', usersRouter)
// app.use('/playlist', playlistRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app

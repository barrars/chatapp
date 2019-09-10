require('dotenv').config()
require('./models/db.js')
const logger = require('./routes/myLogger')
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const playerRouter = require('./routes/playerRouter')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const app = express()
var compression = require('compression')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.enable('trust proxy')
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
const store = new MongoStore({
  url: process.env.MONGO_URL,
  autoRemove: 'interval',
  autoRemoveInterval: 1
})
app.use(
  session({
    store,
    saveUninitialized: false,
    resave: true,
    secret: 'secret'
  })
)

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', indexRouter)
app.use('/public', express.static(path.join(__dirname, '/public')))
app.use('/users', usersRouter)
app.use('/player', playerRouter)
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
  logger.log(err)
})

module.exports = app

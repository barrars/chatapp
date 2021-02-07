require('dotenv').config()
require('./models/db.js')
const logger = require('./routes/myLogger')
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users.router')
const cors = require('cors')
var compression = require('compression')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const app = express()
app.use(cors())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
const playerRouter = require('./routes/playerRouter')
const songList = require('./routes/songList')
const songGet = require('./routes/songGet')
const deleted = require('./routes/deleted')
// app.enable('trust proxy')
const store = new MongoStore({
  url: process.env.MONGO_URL,
  autoRemove: 'native',
  ttl: 14 * 24 * 60 * 60
  // autoRemoveInterval: 1
})
app.use(
  session({
    // cookie: {
    //   secure: false,
    //   sameSite: 'strict'
    // },
    store,
    saveUninitialized: false,
    resave: true,
    secret: 'secret'
  })
)
app.use('/public', express.static(path.join(__dirname, '/public')))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/deleted', deleted)
app.use('/users', usersRouter)
app.use('/player', playerRouter)
app.use('/songList', songList)
app.use('/songGet', songGet)
app.use('/', indexRouter)
// app.use('/playlist', playlistRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // logger.error(req)
  // logger.error(res)

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
  // setTimeout(() => {
  //   res.redirect('/')
  // }, 500)
})

module.exports = app

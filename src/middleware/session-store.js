const session = require('express-session')

const redisStore = require('../../config/redis-store')
const config = require('../../config')

const sessionStore = session({
  store: redisStore,
  proxy: !config.isDev,
  cookie: {
    secure: !config.isDev,
    maxAge: config.session.ttl,
  },
  rolling: true,
  key: 'datahub.sid',
  secret: config.session.secret,
  resave: true,
  saveUninitialized: true,
})

module.exports = sessionStore

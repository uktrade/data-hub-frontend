const session = require('express-session')

const { redisStore } = require('../../config/redis-store')
const config = require('../../config')

const sessionStore = session({
  store: redisStore,
  proxy: config.isProd,
  cookie: {
    secure: config.isProd,
    maxAge: config.session.ttl,
  },
  rolling: true,
  secret: config.session.secret,
  resave: true,
  saveUninitialized: false,
  unset: 'destroy',
  key: 'datahub.sid',
})

module.exports = sessionStore

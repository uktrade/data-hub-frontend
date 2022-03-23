const session = require('express-session')
const redisConnect = require('connect-redis')

const config = require('../config')
const redisClient = require('../lib/redis-client')

const RedisStore = redisConnect(session)
const redisStore = new RedisStore({
  client: redisClient.get(),
  // config ttl defined in milliseconds
  ttl: config.session.ttl / 1000,
  secret: config.session.secret,
})

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

module.exports = {
  sessionStore,
  redisStore,
}

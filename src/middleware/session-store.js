const { RedisStore } = require('connect-redis')
const session = require('express-session')

const redisClient = require('../lib/redis-client')
const config = require('../config')
const logger = require('../config/logger')

const client = redisClient.getClient()
client.connect().catch((error) => logger.error(error))

const redisStore = new RedisStore({
  client,
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

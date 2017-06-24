const redis = require('redis')
const redisCrypto = require('connect-redis-crypto')
const session = require('express-session')
const url = require('url')

const logger = require('./logger')
const config = require('./')

const RedisStore = redisCrypto(session)

let client

if (config.redis.url) {
  const redisURL = url.parse(config.redis.url)
  client = redis.createClient(redisURL.port, redisURL.hostname, { no_ready_check: true })
  client.auth(redisURL.auth.split(':')[1])
} else {
  client = redis.createClient(config.redis.port, config.redis.host)
}

client.on('error', (e) => {
  logger.log('error', 'Error connecting to redis')
  logger.log('error', e)
  throw e
})

client.on('connect', () => {
  logger.log('info', 'connected to redis')
})

client.on('ready', () => {
  logger.log('info', 'connection to redis is ready to use')
})

const redisStore = new RedisStore({
  client,
  // config ttl defined in milliseconds
  ttl: config.session.ttl / 1000,
  secret: config.session.secret,
})

module.exports = redisStore

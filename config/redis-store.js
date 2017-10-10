const Redis = require('redis')
const redisConnect = require('connect-redis')
const session = require('express-session')
const url = require('url')
const logger = require('./logger')
const config = require('./')

const RedisStore = redisConnect(session)

let redisConfig = {
  port: config.redis.port,
  host: config.redis.host,
}

if (config.redis.url) {
  const redisURL = url.parse(config.redis.url)
  redisConfig = {
    port: redisURL.port || config.redis.port,
    host: redisURL.hostname || config.redis.host,
  }
  if (redisURL.auth) {
    redisConfig.password = redisURL.auth.split(':')[1]
  }
}
if (config.redis.useTLS) {
  redisConfig.tls = {
    // allows self-signed certificates
    rejectUnauthorized: false,
  }
  // allows us to retry unsent commands after a timeout
  redisConfig.retry_unfulfilled_commands = true
}

const client = Redis.createClient(redisConfig)

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

client.on('close', () => {
  logger.log('info', 'connection to redis has closed')
})

const redisStore = new RedisStore({
  client,
  // config ttl defined in milliseconds
  ttl: config.session.ttl / 1000,
  secret: config.session.secret,
})
module.exports = redisStore

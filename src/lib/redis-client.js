const redis = require('redis')
const url = require('url')
const { promisify } = require('util')

const config = require('../config')
const logger = require('../config/logger')
const reporter = require('./reporter')

function getRedisConfig() {
  let redisConfig = {
    port: config.redis.port,
    host: config.redis.host,
    legacyMode: true,
  }

  if (config.redis.url) {
    const redisUrl = url.parse(config.redis.url)
    redisConfig = {
      port: redisUrl.port || config.redis.port,
      host: redisUrl.hostname || config.redis.host,
    }
    if (redisUrl.auth) {
      redisConfig.password = redisUrl.auth.split(':')[1]
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

  return redisConfig
}

let client
let asyncGet

function getClient() {
  if (!client) {
    client = redis.createClient(getRedisConfig())

    // eslint-disable-next-line no-console
    client.connect().catch((e) => {
      logger.error('Error during connect step to redis')
      logger.error(e)
      reporter.captureException(e)
    })

    client.on('error', (e) => {
      logger.error('Error connecting to redis')
      logger.error(e)
      reporter.captureException(e)
    })

    client.on('connect', () => {
      logger.info('Connected to redis')
    })

    client.on('ready', () => {
      logger.info('Connection to redis is ready to use')
    })

    client.on('close', () => {
      logger.info('Connection to redis has closed')
    })
  }

  return client
}

module.exports = {
  get: getClient,

  asyncGet: () => {
    if (!asyncGet) {
      const client = getClient()
      asyncGet = promisify(client.get).bind(client)
    }

    return asyncGet
  },
}

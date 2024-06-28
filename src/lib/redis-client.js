const redis = require('redis')
const url = require('url')

const config = require('../config')
const logger = require('../config/logger')
const reporter = require('./reporter')

const message = {
  CONNECT: 'Redis client is initiating a connection to the server',
  READY: 'Redis client is now ready',
  ERROR: 'Redis client has encountered an error',
  END: 'Redis client connection has been closed',
  CREATED: 'Redis client has been created',
  REQUIRED: 'Redis client has not been created',
}

function getRedisConfig() {
  let redisConfig = {
    socket: {
      port: config.redis.port,
      host: config.redis.host,
    },
  }

  if (config.redis.url) {
    const redisUrl = url.parse(config.redis.url)

    redisConfig = {
      socket: {
        port: redisUrl.port || config.redis.port,
        host: redisUrl.hostname || config.redis.host,
      },
    }

    if (redisUrl.auth) {
      redisConfig.password = redisUrl.auth.split(':')[1]
    }
  }

  if (config.redis.useTLS) {
    redisConfig.socket.tls = true
    // allows self-signed certificates
    redisConfig.socket.rejectUnauthorized = false
  }

  return redisConfig
}

let client

const getClient = () => {
  if (!client) {
    client = redis.createClient(getRedisConfig())
    logger.info(message.CREATED, {
      eventType: logger.eventTypes.expressStartup,
    })
    client.on('connect', () => {
      logger.info(message.CONNECT, {
        eventType: logger.eventTypes.expressStartup,
      })
    })
    client.on('ready', () => {
      logger.info(message.READY, {
        eventType: logger.eventTypes.expressStartup,
      })
    })
    client.on('error', (e) => {
      logger.error(message.ERROR, e, {
        eventType: logger.eventTypes.expressStartup,
      })
      reporter.captureException(e)
    })
    client.on('end', () => {
      logger.info(message.END, { eventType: logger.eventTypes.expressStartup })
    })
  }
  return client
}

const pingServer = async () => {
  const client = getClient()
  return new Promise(async (resolve, reject) => {
    try {
      const ok = await client.ping('OK')
      resolve({ statusText: ok })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  getClient,
  pingServer,
}

const redisClient = require('../lib/redis-client')

module.exports = async (req, res, next) => {
  const client = redisClient.getClient()
  if (client.isReady) {
    next()
  } else {
    res.render('redis-lost')
  }
}

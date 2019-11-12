const redisClient = require('../lib/redis-client')

const client = redisClient.get()
let connected = false

client.on('error', () => {
  connected = false
})

client.on('ready', () => {
  connected = true
})

module.exports = (req, res, next) => {
  if (connected) {
    next()
  } else {
    res.render('redis-lost')
  }
}

const axios = require('axios')

const config = require('../../config')
const redisClient = require('../../lib/redis-client')

module.exports = [
  {
    name: 'api',
    healthCheck: () => axios.get(`${config.apiRoot}/pingdom/ping.xml`),
  },
  {
    name: 'redis',
    healthCheck: () => redisClient.pingServer(),
  },
  {
    name: 'getaddress postcode lookup',
    warningOnly: true,
    healthCheck: () =>
      axios.get(
        `https://api.getaddress.io/usage?api-key=${config.postcodeLookup.apiKey}`
      ),
  },
]

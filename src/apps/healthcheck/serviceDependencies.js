const axios = require('axios')
const config = require('../../config')
const redisClient = require('../../lib/redis-client')

const client = redisClient.get()

module.exports = [
  {
    name: 'api',
    healthCheck: () => axios.get(`${config.apiRoot}/ping.xml`),
  },
  {
    name: 'redis',
    healthCheck: () => {
      return new Promise((resolve, reject) => {
        client.ping('OK', (err, result) => {
          if (err) {
            return reject(err)
          }

          return resolve({ statusText: result })
        })
      })
    },
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

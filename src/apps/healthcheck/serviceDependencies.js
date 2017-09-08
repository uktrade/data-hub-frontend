const axios = require('axios')
const config = require('../../../config')
const redisStore = require('../../../config/redis-store')

module.exports = [
  {
    name: 'leeloo',
    healthCheck: () => axios.get(`${config.apiRoot}/ping.xml`),
  },
  {
    name: 'redis',
    healthCheck: () => {
      return new Promise((resolve, reject) => {
        redisStore.client.ping('OK', (err, result) => {
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
    healthCheck: () => axios.get(`https://api.getaddress.io/usage?api-key=${config.postcodeLookup.apiKey}`),
  },
]

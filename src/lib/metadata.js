const config = require('../config')
const logger = require('../config/logger')
const hawkRequest = require('./hawk-request')

let redisClient

function getMetadata(path, key) {
  const url = `${config.apiRoot}/v4/metadata/${path}`

  if (redisClient) {
    return new Promise((resolve, reject) => {
      const ttl = config.redis.metadataTtl

      redisClient.get(url, (err, data) => {
        if (!err && data) {
          data = JSON.parse(data)
          module.exports[key] = data
          resolve(data)
        } else {
          hawkRequest(url)
            .then((responseData) => {
              module.exports[key] = responseData
              redisClient.setex(url, ttl, JSON.stringify(responseData))
              resolve(responseData)
            })
            .catch((reponseError) => {
              logger.error('Error fetching metadataRepository for url: %s', url)
              reject(reponseError)
              throw reponseError
            })
        }
      })
    })
  }

  return hawkRequest(url)
    .then((responseData) => {
      module.exports[key] = responseData
      return responseData
    })
    .catch((err) => {
      logger.error('Error fetching metadataRepository for url: %s', url)
      throw err
    })
}

const metadataItems = [['investment-project-stage', 'investmentProjectStage']]

// TODO: Get rid of this
module.exports.fetchAll = (cb) => {
  // todo
  // refactor to create an array of jobs to do and then use promise all
  // before returning back via a promise.

  let caughtErrors
  let totalRequests = 0
  let completeRequests = 0

  function checkResults() {
    completeRequests += 1
    if (completeRequests === totalRequests) {
      logger.info('All metadataRepository requests complete')
      cb(caughtErrors)
    }
  }

  for (const item of metadataItems) {
    totalRequests += 1
    getMetadata(item[0], item[1])
      .then((data) => {
        if (item[2]) {
          item[2](data)
        }

        checkResults()
      })
      .catch((err) => {
        caughtErrors = caughtErrors || []
        caughtErrors.push(err)
        checkResults()
      })
  }
}

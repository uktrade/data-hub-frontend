const winston = require('winston')
const authorisedRequest = require('../lib/authorisedrequest')
const config = require('../config')

let redisClient

function getMetadata (path, key) {
  const ttl = config.redis.metadataTtl
  const url = `${config.apiRoot}/metadata/${path}/`

  if (redisClient) {
    return new Promise((resolve, reject) => {
      redisClient.get(url, (err, data) => {
        if (!err && data) {
          data = JSON.parse(data)
          module.exports[key] = data
          resolve(data)
        } else {
          authorisedRequest(null, url)
          .then((responseData) => {
            module.exports[key] = responseData
            redisClient.setex(url, ttl, JSON.stringify(responseData))
            resolve(responseData)
          })
          .catch((reponseError) => {
            winston.log('error', 'Error fetching metadataRepository for url: %s', url)
            reject(reponseError)
            throw reponseError
          })
        }
      })
    })
  }

  return authorisedRequest(null, url)
    .then((responseData) => {
      module.exports[key] = responseData
      return responseData
    })
    .catch((err) => {
      winston.log('error', 'Error fetching metadataRepository for url: %s', url)
      throw err
    })
}

module.exports.getMetadataItem = function (table, id) {
  const url = `${config.apiRoot}/metadata/${table}/`

  return new Promise((resolve, reject) => {
    authorisedRequest(null, url)
    .then((data) => {
      data.forEach((item) => {
        if (item.id === id) {
          resolve(item)
        }
      })
    })
    .catch((error) => {
      reject(error)
    })
  })
}

const metadataItems = [
  ['sector', 'SECTOR_OPTIONS'],
  ['turnover', 'TURNOVER_OPTIONS'],
  ['uk-region', 'REGION_OPTIONS'],
  ['country', 'COUNTRYS'],
  ['employee-range', 'EMPLOYEE_OPTIONS'],
  ['business-type', 'TYPES_OF_BUSINESS'],
  ['team', 'TEAMS'],
  ['interaction-type', 'TYPES_OF_INTERACTION'],
  ['service-delivery-status', 'SERVICE_DELIVERY_STATUS_OPTIONS'],
  ['event', 'EVENT_OPTIONS']
]

const restrictedServiceKeys = [
  'Account Management',
  'Bank Referral',
  'Digital Trade Advisers One-to-One',
  'Events – Overseas',
  'Events - UK Based',
  'Events – Webinars',
  'First Time Exporters - Export Insight Visits',
  'First Time Exporters – Export Savvy',
  'Language and Culture Advisers One-to-One',
  'Market Selection Service (MSS)',
  'Market Visit Support (MVS)',
  'Onward Referral',
  'Open to Export Assist (OtE)',
  'Outward Missions',
  'Overseas Business Network Advisers One-to-One',
  'Overseas Market Introduction Service (OMIS)',
  'Postgraduates for International Business - Placement',
  'Significant Assistance (PIMS)',
  'Trade - ECR Web Action Plan',
  'UK Region Local]']

module.exports.setRedisClient = (client) => {
  redisClient = client
}

module.exports.fetchAll = (cb) => {
  // todo
  // refactor to create an array of jobs to do and then use promise all
  // before returning back via a promise.

  let caughtErrors
  let totalRequests = 0
  let completeRequests = 0

  function checkResults () {
    completeRequests += 1
    if (completeRequests === totalRequests) {
      winston.log('debug', 'All metadataRepository requests complete')
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

module.exports.REASONS_FOR_ARCHIVE = [
  'Company is dissolved',
  'Other'
]

module.exports.getServiceOffers = function (token) {
  return authorisedRequest(token, `${config.apiRoot}/metadata/service/`)
}

module.exports.initialiseRestrictedServiceOptions = function () {
  authorisedRequest(null, `${config.apiRoot}/metadata/service/`)
  .then((data) => {
    module.exports.SERVICE_DELIVERY_SERVICE_OPTIONS = data.filter(service => restrictedServiceKeys.includes(service.name))
  })
}


const { get } = require('lodash')
const Redis = require('redis')
const config = require('../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

let client, redisAsync
if (!config.isTest) {
  const { promisify } = require('util')
  const { getRedisConfig } = require('../../config/redis-store')

  client = Redis.createClient({ ...getRedisConfig(), url: config.redis.url })
  redisAsync = promisify(client.get).bind(client)
}

async function getAdvisers (token) {
  let results
  const url = `${config.apiRoot}/adviser/?limit=100000&offset=0`
  const advisers = config.isTest ? null : await redisAsync('advisers')

  if (advisers) {
    results = JSON.parse(advisers)
  } else {
    const response = await authorisedRequest(token, url)

    results = response.results.filter(
      adviser => get(adviser, 'name', '').trim().length
    )
    if (!config.isTest) {
      client.set(
        'advisers',
        JSON.stringify(results),
        'EX',
        config.cacheDurationShort
      )
    }
  }

  return {
    results,
    count: results.length,
  }
}

function getAdviser (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/adviser/${id}/`)
}

async function fetchAdviserSearchResults (token, params) {
  const isActive = params.is_active ? '&is_active=true' : ''
  const url = `${config.apiRoot}/adviser/?autocomplete=${
    params.term
  }${isActive}`
  const adviserResults = await authorisedRequest(token, { url })
  return adviserResults.results
}

module.exports = {
  getAdvisers,
  getAdviser,
  fetchAdviserSearchResults,
}

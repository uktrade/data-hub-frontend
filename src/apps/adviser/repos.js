const { promisify } = require('util')
const { get } = require('lodash')
const Redis = require('redis')

const config = require('../../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

const redisOpts = {
  url: config.redis.url,
  cacheDuration: config.cacheDurationShort,
}

const client = Redis.createClient(redisOpts)
const redisAsync = promisify(client.get).bind(client)

async function getAdvisers (token) {
  const advisers =
    process.env.NODE_ENV === 'test' ? null : await redisAsync('advisers')
  const url = `${config.apiRoot}/adviser/?limit=100000&offset=0`
  let results

  if (advisers) {
    results = JSON.parse(advisers)
  } else {
    const response = await authorisedRequest(token, url)

    results = response.results.filter(
      adviser => get(adviser, 'name', '').trim().length
    )

    client.set(
      'advisers',
      JSON.stringify(results),
      'EX',
      redisOpts.cacheDuration
    )
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

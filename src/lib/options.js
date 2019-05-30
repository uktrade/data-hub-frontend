const { castArray, sortBy } = require('lodash')
const Redis = require('redis')

const config = require('../../config')
const { authorisedRequest } = require('../lib/authorised-request')
const { filterDisabledOption } = require('../modules/permissions/filters')
const { transformObjectToOption } = require('../apps/transformers')

let client, redisAsync
if (!config.isTest) {
  const { getRedisConfig } = require('../../config/redis-store')
  const { promisify } = require('util')

  client = Redis.createClient({ ...getRedisConfig(), url: config.redis.url })
  redisAsync = promisify(client.get).bind(client)
}

async function fetchOptions (token, url) {
  let metaData = config.isTest ? null : await redisAsync(url)

  if (metaData) {
    return JSON.parse(metaData)
  }
  metaData = await authorisedRequest(token, url)
  if (!config.isTest) {
    client.set(url, JSON.stringify(metaData), 'ex', config.cacheDurationLong)
  }

  return metaData
}

async function getOptions (
  token,
  key,
  {
    createdOn,
    currentValue,
    includeDisabled = false,
    sorted = true,
    term,
    id,
    queryString = '',
    context,
  } = {}
) {
  if (id) {
    return getOptionsForId(token, key, id)
  }

  if (context) {
    if (queryString.length > 0) {
      queryString = `${queryString}&contexts__has_any=${context}`
    } else {
      queryString = `?contexts__has_any=${context}`
    }
  }

  const url = `${config.apiRoot}/metadata/${key}/${queryString}`
  let options = await fetchOptions(token, url)

  if (!includeDisabled) {
    options = options.filter(filterDisabledOption({ currentValue, createdOn }))
  }

  if (term) {
    const lowercaseTerm = term.toLowerCase()
    options = options.filter(option => {
      return option.name.toLowerCase().startsWith(lowercaseTerm)
    })
  }

  if (context) {
    options = options.filter(option => {
      return !option.contexts || option.contexts.includes(context)
    })
  }

  const mappedOptions = options.map(transformObjectToOption)

  return sorted ? sortBy(mappedOptions, 'label') : mappedOptions
}

async function getOptionsForId (token, key, id) {
  const ids = castArray(id)
  const options = []

  for (let index = 0; index < ids.length; index += 1) {
    const url =
      key === 'adviser'
        ? `${config.apiRoot}/adviser/${ids[index]}/`
        : `${config.apiRoot}/v3/${key}/${ids[index]}`
    const data = await authorisedRequest(token, url)
    options.push({
      value: data.id,
      label: data.name,
    })
  }

  return options
}

module.exports = {
  getOptions,
  fetchOptions,
}

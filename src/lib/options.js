const { castArray, sortBy } = require('lodash')

const config = require('../config')
const { authorisedRequest } = require('../lib/authorised-request')
const hawkRequest = require('../lib/hawk-request')
const { filterDisabledOption } = require('../modules/permissions/filters')
const { transformObjectToOption } = require('../apps/transformers')

let client, redisAsyncGet

if (!config.isTest) {
  const redisClient = require('./redis-client')

  client = redisClient.get()
  redisAsyncGet = redisClient.asyncGet()
}

async function fetchOptions(req, url) {
  let metaData = config.isTest ? null : await redisAsyncGet(url)

  if (metaData) {
    return JSON.parse(metaData)
  }
  metaData = await hawkRequest(url)
  if (!config.isTest) {
    client.set(url, JSON.stringify(metaData), 'ex', config.cacheDurationLong)
  }

  return metaData
}

async function getOptions(
  req,
  key,
  {
    createdOn,
    currentValue,
    includeDisabled = false,
    sorted = true,
    sortPropertyName = 'label',
    term,
    id,
    queryString = '',
    context,
    transformer = transformObjectToOption,
    transformWithoutMapping = false,
  } = {}
) {
  if (id) {
    return getOptionsForId(req, key, id)
  }

  if (context) {
    if (queryString.length > 0) {
      queryString = `${queryString}&contexts__has_any=${context}`
    } else {
      queryString = `?contexts__has_any=${context}`
    }
  }

  const url = `${config.apiRoot}/v4/metadata/${key}${queryString}`
  let options = await fetchOptions(req, url)

  if (!includeDisabled) {
    options = options.filter(filterDisabledOption({ currentValue, createdOn }))
  }

  if (term) {
    const lowercaseTerm = term.toLowerCase()
    options = options.filter((option) => {
      return option.name.toLowerCase().startsWith(lowercaseTerm)
    })
  }

  if (context) {
    options = options.filter((option) => {
      return !option.contexts || option.contexts.includes(context)
    })
  }

  if (transformWithoutMapping) {
    return transformer(options)
  }

  const mappedOptions = options.map(transformer)

  return sorted ? sortBy(mappedOptions, sortPropertyName) : mappedOptions
}

async function getOptionsForId(req, key, id) {
  const ids = castArray(id)
  const options = []

  for (let index = 0; index < ids.length; index += 1) {
    const url =
      key === 'adviser'
        ? `${config.apiRoot}/adviser/${ids[index]}/`
        : `${config.apiRoot}/v3/${key}/${ids[index]}`
    const data = await authorisedRequest(req, url)
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

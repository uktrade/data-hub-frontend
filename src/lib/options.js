const { sortBy } = require('lodash')

const config = require('../../config')
const authorisedRequest = require('../lib/authorised-request')
const { filterDisabledOption } = require('../apps/filters')
const { transformObjectToOption } = require('../apps/transformers')

async function getOptions (token, key, { createdOn, currentValue, includeDisabled = false, sorted = true, term } = {}) {
  const url = `${config.apiRoot}/metadata/${key}/`
  let options = await authorisedRequest(token, url)

  if (!includeDisabled) {
    options = options.filter(filterDisabledOption({ currentValue, createdOn }))
  }

  if (term) {
    const lterm = term.toLowerCase()
    options = options.filter((option) => {
      return option.name.toLowerCase().startsWith(lterm)
    })
  }

  const mappedOptions = options.map(transformObjectToOption)

  return sorted ? sortBy(mappedOptions, 'label') : mappedOptions
}

module.exports = {
  getOptions,
}

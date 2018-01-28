const { sortBy } = require('lodash')

const config = require('../../config')
const authorisedRequest = require('../lib/authorised-request')
const { filterDisabledOption } = require('../apps/filters')
const { transformObjectToOption } = require('../apps/transformers')

async function getOptions (token, key, { createdOn, currentValue, includeDisabled = false, term } = {}) {
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

  return sortBy(options.map(transformObjectToOption), 'label')
}

module.exports = {
  getOptions,
}

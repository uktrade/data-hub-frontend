const config = require('../../config')
const authorisedRequest = require('../lib/authorised-request')
const { filterDisabledOption } = require('../apps/filters')
const { transformObjectToOption } = require('../apps/transformers')
const logger = require('../../config/logger')

async function getOptions (token, key, { createdOn, currentValue, includeDisabled = false } = {}) {
  try {
    const url = `${config.apiRoot}/metadata/${key}/`
    let options = await authorisedRequest(token, url)

    if (!includeDisabled) {
      options = options.filter(filterDisabledOption({ currentValue, createdOn }))
    }

    return options.map(transformObjectToOption)
  } catch (error) {
    logger.error(error)
    return []
  }
}

module.exports = {
  getOptions,
}

const axios = require('axios')
const { isString } = require('lodash')
const { StatusCodeError } = require('./errors')

const logger = require('../config/logger')

/**
 * Strip scripts from JSON
 *
 * Note that this shouldn't be needed since everything should be escaped when
 * it is rendered.
 */
const stripScripts = (key, value) => {
  if (isString(value)) {
    return stripScript(value)
  }
  return value
}

const stripScript = (text) => {
  const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
  while (SCRIPT_REGEX.test(text)) {
    logger.warn('Found script tag in response')
    text = text.replace(SCRIPT_REGEX, '')
  }
  return text
}

/**
 * Axios request translator to ensure a consistent interface.
 *
 * By using this, we could go on to replace axios with another library without
 * breaking tests.
 */
const request = async (props) => {
  const baseConfig = isString(props) ? { url: props } : props
  let transformResponse = [].concat(axios.defaults.transformResponse)
  if (!props.responseType || props.responseType === 'json') {
    transformResponse.push((data) =>
      JSON.parse(JSON.stringify(data), stripScripts)
    )
  }

  try {
    return await axios({ ...baseConfig, transformResponse })
  } catch (error) {
    const { response } = error
    if (response) {
      throw new StatusCodeError(response.data, response.status)
    } else {
      if (error.toJSON) {
        throw Error(error.toJSON().message)
      } else {
        throw Error(error)
      }
    }
  }
}

module.exports = request

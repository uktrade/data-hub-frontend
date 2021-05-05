const axios = require('axios')

/**
 * This error is thrown when a response gives a bad status code.
 */
class StatusCodeError extends Error {
  constructor(message, statusCode) {
    super(message)

    this.error = message
    this.statusCode = statusCode

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StatusCodeError)
    }
  }
}

/**
 * Axios request translator to ensure a consistent interface.
 *
 * By using this, we could go on to replace axios with another library without
 * breaking tests.
 */
const request = async (props) => {
  try {
    return await axios(props)
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

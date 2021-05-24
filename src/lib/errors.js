/**
 * This error is thrown when a response gives a bad status code.
 */
class StatusCodeError extends Error {
  constructor(message, statusCode) {
    super(message)

    this.message = `${statusCode} - ${JSON.stringify(message)}`
    this.error = message
    this.statusCode = statusCode

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StatusCodeError)
    }
  }
}

module.exports = { StatusCodeError }

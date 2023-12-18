const config = require('../config')
const logger = require('../config/logger')

class NotAuthorizedError extends Error {
  constructor() {
    super('Not Authorized')
    this.statusCode = 403
  }
}

class NotFoundError extends Error {
  constructor() {
    super('Not Found')
    this.statusCode = 404
  }
}

function getStatusMessage(error) {
  if (error.code === 'EBADCSRFTOKEN') {
    return 'This form has been tampered with'
  }

  if (error.statusCode === 404) {
    return 'Page not found'
  }

  if (error.statusCode === 403 || error.statusCode === 401) {
    return "You don't have permission to view this page"
  }

  return 'Page unavailable'
}

function notFound(req, res, next) {
  next(new NotFoundError())
}

function catchAll(error, req, res, next) {
  const statusCode = error.statusCode || 500

  if (res.headersSent || statusCode === 400) {
    return next(error)
  }

  logger[statusCode === 404 ? 'info' : 'error'](error)

  res.locals.BREADCRUMBS = null
  res.status(statusCode).render('errors', {
    error,
    statusCode,
    statusMessage: getStatusMessage(error),
    showStackTrace: config.isDev,
  })
}

/*
 * Returns an array of each field and its error message from an error object.
 */
function getBadRequestError(error) {
  if (!error?.error) {
    return
  }

  let apiErrors = []
  for (const [field, errors] of Object.entries(error.error)) {
    apiErrors.push(`${field}: ${errors.join(', ')}`)
  }

  return apiErrors
}

function badRequest(error, req, res, next) {
  const statusCode = error.statusCode || 500

  if (statusCode !== 400) {
    return next(error)
  }

  const apiErrors = getBadRequestError(error)

  res.status(statusCode).json({
    error: {
      message: apiErrors || 'Request failed with status code 400',
      status: statusCode,
    },
  })
}

module.exports = {
  notFound,
  NotAuthorizedError,
  NotFoundError,
  catchAll,
  badRequest,
}

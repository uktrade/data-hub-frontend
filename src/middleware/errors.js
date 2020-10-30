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
    return 'You don’t have permission to view this page'
  }

  return 'Page unavailable'
}

// TODO: remove this/integrate into getStatusMessage
function getAxiosStatusMessage(error) {
  // TODO: investigate how this would be demoed in axios
  if (error.code === 'EBADCSRFTOKEN') {
    return 'This form has been tampered with'
  }

  if (error.response.status === 404) {
    return 'Page not found'
  }

  if (error.response.status === 403 || error.response.status === 401) {
    return 'You don’t have permission to view this page'
  }

  return 'Page unavailable'
}

function notFound(req, res, next) {
  next(new NotFoundError())
}

// TODO: remove this/integrate into catchAll
// - this is a horrible interim function while 'request' is replaced with 'axios'
function handleAxiosErrors(error, res) {
  const statusCode = error.response.status || 500

  logger[statusCode === 404 ? 'info' : 'error'](error)
  res.locals.BREADCRUMBS = null
  res.status(statusCode).render('errors', {
    error,
    statusCode,
    statusMessage: getAxiosStatusMessage(error),
    showStackTrace: config.isDev,
  })
}

function catchAll(error, req, res, next) {
  if (res.headersSent) {
    return next(error)
  }

  // TODO: remove this Axios request trigger (just in place as we transition)
  if (error.response && error.response.status) {
    return handleAxiosErrors(error, res)
  }

  const statusCode = error.statusCode || 500

  logger[statusCode === 404 ? 'info' : 'error'](error)

  res.locals.BREADCRUMBS = null
  res.status(statusCode).render('errors', {
    error,
    statusCode,
    statusMessage: getStatusMessage(error),
    showStackTrace: config.isDev,
  })
}

module.exports = {
  notFound,
  NotAuthorizedError,
  NotFoundError,
  catchAll,
}

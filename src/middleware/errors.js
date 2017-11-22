const config = require('../../config')
const logger = require('../../config/logger')

function getStatusMessage (error) {
  if (error.code === 'EBADCSRFTOKEN') {
    return 'This form has been tampered with'
  }

  if (error.statusCode === 404) {
    return 'Page not found'
  }

  if (error.statusCode === 403) {
    return 'You don’t have permission to view this page'
  }

  return 'Page unavailable'
}

function notFound (req, res, next) {
  const error = new Error('Not Found')
  error.statusCode = 404

  next(error)
}

function catchAll (error, req, res, next) {
  const statusCode = error.statusCode || 500

  if (res.headersSent) {
    return next(error)
  }

  logger[statusCode === 404 ? 'info' : 'error'](error)

  res.locals.BREADCRUMBS = null
  res
    .status(statusCode)
    .render('errors', {
      error,
      statusCode,
      statusMessage: getStatusMessage(error),
      showStackTrace: config.isDev,
    })
}

module.exports = {
  notFound,
  catchAll,
}

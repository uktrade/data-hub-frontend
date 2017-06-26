const config = require('../../config')
const logger = require('../../config/logger')

function notFound (req, res, next) {
  const error = new Error('Not Found')
  error.statusCode = 404

  next(error)
}

function catchAll (error, req, res, next) {
  const statusCode = error.statusCode = (error.statusCode || 500)
  let statusMessage = statusCode === 404
    ? 'Sorry we couldn\'t find that page!'
    : 'Sorry something has gone wrong!'

  if (error.code === 'EBADCSRFTOKEN') {
    statusMessage = 'This form has been tampered with'
  }

  if (res.headersSent) {
    return next(error)
  }

  logger[statusCode === 404 ? 'info' : 'error'](error)

  res.status(statusCode)
    .render('errors', {
      statusCode,
      statusMessage,
      devErrorDetail: config.isDev && error,
    })
}

module.exports = {
  notFound,
  catchAll,
}

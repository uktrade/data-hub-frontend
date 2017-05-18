const config = require('../config')
const winston = require('winston')

function notFound (req, res, next) {
  const error = new Error('Not Found')
  error.status = 404

  next(error)
}

function catchAll (error, req, res, next) {
  const statusCode = error.status = (error.status || 500)
  const statusMessage = statusCode === 404
    ? 'Sorry we couldn\'t find that page!'
    : 'Sorry something has gone wrong!'

  if (res.headersSent) {
    return next(error)
  }

  winston[statusCode === 500 ? 'error' : 'info'](error)

  res.status(statusCode)
    .render('errors/index', {
      statusCode,
      statusMessage,
      devErrorDetail: config.isDev && error
    })
}

module.exports = {
  notFound,
  catchAll
}

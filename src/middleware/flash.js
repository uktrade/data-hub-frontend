const winston = require('winston')

module.exports = (req, res, next) => {
  winston.debug('flash:start')
  const formErrors = req.flash('error')

  res.locals.messages = {
    success: req.flash('success-message'),
    error: req.flash('error-message'),
    info: req.flash('info')
  }

  if (formErrors && formErrors.length) {
    res.locals.messages.formErrors = formErrors
  }

  winston.debug('flash:end')
  next()
}

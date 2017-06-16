const logger = require('../../config/logger')

module.exports = (req, res, next) => {
  logger.debug('flash:start')
  const formErrors = req.flash('error')

  res.locals.messages = {
    success: req.flash('success-message'),
    error: req.flash('error-message'),
    info: req.flash('info'),
  }

  if (formErrors && formErrors.length) {
    res.locals.messages.formErrors = formErrors
  }

  logger.debug('flash:end')
  next()
}

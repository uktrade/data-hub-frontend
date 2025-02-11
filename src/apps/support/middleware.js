const { isEmpty, pickBy } = require('lodash')

const logger = require('../../config/logger')
const { createZenDeskMessage, postToZenDesk } = require('./services')

async function postFeedback(req, res, next) {
  const { title, feedback_type, email } = req.body

  const validateEmail = () => {
    if (email.length > 345 || !email.match(/.*@.*\..*/)) {
      return 'A valid email address is required'
    }
  }

  const messages = pickBy({
    title: !title && 'Your feedback needs a title',
    feedback_type:
      !feedback_type &&
      'You need to choose between raising a problem and leaving feedback',
    email: validateEmail(),
  })

  res.locals.formErrors = Object.assign({}, res.locals.formErrors, {
    messages,
  })

  const hasErrors =
    !isEmpty(res.locals.formErrors.messages) || res.locals.formErrors.summary

  if (hasErrors) {
    return next()
  }

  const ticket = createZenDeskMessage(req.body)

  try {
    const response = await postToZenDesk(ticket)
    // TODO: Look into improving confirmation page https://www.gov.uk/service-manual/design/confirmation-pages
    req.flash(
      'success',
      `Created new report, reference number ${response.data.ticket.id}`
    )
    res.redirect('/support/thank-you')
  } catch (error) {
    logger.error(error)
    res.locals.formErrors = {
      summary: error.message,
    }
    next()
  }
}

module.exports = {
  postFeedback,
}

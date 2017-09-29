const { isEmpty, pickBy } = require('lodash')

const logger = require('../../../config/logger')
const { createZenDeskMessage, postToZenDesk } = require('./services')

async function postFeedback (req, res, next) {
  const { title, feedbackType, email } = req.body

  const messages = pickBy({
    title: !title && 'Your feedback needs a title',
    feedbackType: !feedbackType && 'You need to choose between raising a problem and leaving feedback',
    email: (email && !email.match(/.*@.*\..*/)) && 'A valid email address is required',
  })

  res.locals.formErrors = Object.assign({}, res.locals.formErrors, {
    messages,
  })

  const hasErrors = !isEmpty(res.locals.formErrors.messages) || res.locals.formErrors.summary

  if (hasErrors) {
    return next()
  }

  const ticket = createZenDeskMessage(req.body)

  try {
    const response = await postToZenDesk(ticket)
    // TODO: Look into improving confirmation page https://www.gov.uk/service-manual/design/confirmation-pages
    req.flash('success', `Created new report, reference number ${response.data.ticket.id}`)
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

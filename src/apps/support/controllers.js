const { get, merge } = require('lodash')
const { title } = require('case')
const Sniffr = require('sniffr')
const { feedbackFormConfig } = require('./macros')
const { buildFormWithStateAndErrors } = require('../builders')
const config = require('../../config')

function renderFeedbackPage(req, res) {
  const sniffr = new Sniffr()
  sniffr.sniff(req.headers['user-agent'])

  const browserInfo = `${title(sniffr.browser.name)} ${
    sniffr.browser.versionString
  }, ${title(sniffr.os.name)} ${sniffr.os.versionString}`

  const feedbackForm = buildFormWithStateAndErrors(
    feedbackFormConfig(browserInfo),
    req.body,
    get(res.locals, 'formErrors.messages')
  )

  const helpCentre = config.helpCentre
  const zendesk = config.zen

  res
    .title('Report a problem or leave feedback')
    .render('support/views/feedback', {
      // TODO: Fix form builder to ensure it accepts the whole form object not just the messages
      feedbackForm: merge(feedbackForm, {
        errors: res.locals.formErrors,
      }),
      helpCentre,
      props: {
        zenVariables: zendesk,
      },
    })
}

function renderThankYouPage(req, res) {
  res.breadcrumb('Thank you').render('support/views/thank-you')
}

module.exports = {
  renderFeedbackPage,
  renderThankYouPage,
}

const { get, merge } = require('lodash')
const { title } = require('case')
const Sniffr = require('sniffr')
const { feedbackFormConfig } = require('./macros')
const { buildFormWithStateAndErrors } = require('../builders')

function renderFeedbackPage (req, res) {
  const sniffr = new Sniffr()
  sniffr.sniff(req.headers['user-agent'])

  const browserInfo = `${title(sniffr.browser.name)} ${sniffr.browser.versionString}, ${title(sniffr.os.name)} ${sniffr.os.versionString}`

  const feedbackForm = buildFormWithStateAndErrors(
    feedbackFormConfig(browserInfo),
    req.body,
    get(res.locals, 'formErrors.messages'),
  )

  res
    .title('Report a problem or leave feedback')
    .render('support/views/feedback', {
      // TODO: Fix form builder to ensure it accepts the whole form object not just the messages
      feedbackForm: merge(feedbackForm, {
        errors: res.locals.formErrors,
      }),
    })
}

function renderThankYouPage (req, res) {
  res
    .breadcrumb('Thank you')
    .render('support/views/thank-you', {
      heading: 'Thank you',
    })
}

module.exports = {
  renderFeedbackPage,
  renderThankYouPage,
}

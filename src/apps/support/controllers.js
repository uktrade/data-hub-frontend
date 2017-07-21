function renderFeedbackPage (req, res) {
  res.render('support/views/feedback', {
    pageHeading: 'Report a problem or leave feedback',
  })
}

function renderThankYouPage (req, res) {
  res
    .breadcrumb('Thank you')
    .render('support/views/thank-you', {
      pageHeading: 'Thank you',
    })
}

module.exports = {
  renderFeedbackPage,
  renderThankYouPage,
}

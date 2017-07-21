function renderFeedbackPage (req, res) {
  res.render('support/views/feedback')
}

function renderThankYouPage (req, res) {
  res
    .breadcrumb.add('Thank you')
    .render('support/views/thank-you')
}

module.exports = {
  renderFeedbackPage,
  renderThankYouPage,
}

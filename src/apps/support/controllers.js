function renderFeedbackPage (req, res) {
  res.render('support/views/feedback', {
    title: 'Feedback',
  })
}

function renderThankYouPage (req, res) {
  req.breadcrumbs('Thank you')
  res.render('support/views/thank-you', {
    title: ['Thank you', 'Support'],
  })
}

module.exports = {
  renderFeedbackPage,
  renderThankYouPage,
}

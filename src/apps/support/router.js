const router = require('express').Router()

const { postFeedback } = require('./middleware')
const { renderFeedbackPage, renderThankYouPage } = require('./controllers')

router
  .route('/')
  .post(postFeedback)
  .all(renderFeedbackPage)

router.get('/thank-you', renderThankYouPage)

module.exports = router

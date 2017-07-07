const router = require('express').Router()

const { populateFormData, validateForm, submitForm } = require('./middleware')
const { renderFeedbackPage, renderThankYouPage } = require('./controllers')

router
  .route('/')
  .get(populateFormData, renderFeedbackPage)
  .post(populateFormData, validateForm, submitForm, renderFeedbackPage)

router.get('/thank-you', renderThankYouPage)

module.exports = router

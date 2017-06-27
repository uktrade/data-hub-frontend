const router = require('express').Router()

const feedbackController = require('./controllers/feedback')
const thankyouController = require('./controllers/thank-you')

router
  .route('/bug')
  .get(feedbackController.getBug)
  .post(feedbackController.postBug)

router.get('/thank-you', thankyouController.get)

module.exports = router

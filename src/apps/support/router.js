const router = require('express').Router()

const feedbackController = require('./controllers/feedback.controller')
const thankyouController = require('./controllers/thank-you.controller')

router
  .route('/bug')
  .get(feedbackController.getBug)
  .post(feedbackController.postBug)

router.get('/thank-you', thankyouController.get)

module.exports = {
  path: '/support',
  router,
}

const router = require('express').Router()

const signinController = require('./controllers/sign-in')
const signoutController = require('./controllers/sign-out')

router
  .route('/sign-in')
  .get(signinController.getHandler)
  .post(signinController.postHandler)

router.get('/sign-out', signoutController.getHandler)

module.exports = router

const router = require('express').Router()

const signinController = require('./controllers/sign-in')
const signoutController = require('./controllers/sign-out')

router
  .route('/')
  .get(signinController.getHandler)
  .post(signinController.postHandler)

router.get('/signout', signoutController.getHandler)

module.exports = router

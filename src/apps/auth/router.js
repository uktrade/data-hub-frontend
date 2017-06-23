const router = require('express').Router()

const signinController = require('./controllers/sign-in.controller')
const signoutController = require('./controllers/sign-out.controller')

router
  .route('/')
  .get(signinController.getHandler)
  .post(signinController.postHandler)

router.get('/signout', signoutController.getHandler)

module.exports = {
  path: '/login',
  router,
}

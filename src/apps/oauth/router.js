const router = require('express').Router()
const {
  callbackOAuth,
  redirectOAuth,
  signOutOAuth,
  handleMissingState,
} = require('./controllers')

router.get('/', redirectOAuth)
router.get('/callback', handleMissingState, callbackOAuth)
router.get('/sign-out', signOutOAuth)

module.exports = router

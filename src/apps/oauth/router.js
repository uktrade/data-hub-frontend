const router = require('express').Router()
const { callbackOAuth, redirectOAuth, signOutOAuth } = require('./controllers')

router.get('/', redirectOAuth)
router.get('/callback', callbackOAuth)
router.get('/sign-out', signOutOAuth)

module.exports = router

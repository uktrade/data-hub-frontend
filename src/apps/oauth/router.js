const router = require('express').Router()
const { callbackOAuth, redirectOAuth } = require('./controllers')

router.get('/', redirectOAuth)
router.get('/callback', callbackOAuth)

module.exports = router

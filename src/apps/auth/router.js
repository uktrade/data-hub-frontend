const router = require('express').Router()

const { handleSignIn } = require('./middleware')
const { renderSignInPage, signOut } = require('./controllers')

router.all('/sign-in', handleSignIn, renderSignInPage)
router.get('/sign-out', signOut)

module.exports = router

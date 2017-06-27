const router = require('express').Router()

function getHandler (req, res) {
  res.render('profile/views/profile', {
    title: 'Your account',
  })
}

module.exports = {
  router: router.get('/profile', getHandler),
  controllers: {
    getHandler,
  },
}

const router = require('express').Router()

function getHandler (req, res) {
  req.breadcrumbs('Your profile')
  res.render('profile/views/profile', {
    title: 'Your profile',
  })
}

module.exports = {
  router: router.get('/profile', getHandler),
  controllers: {
    getHandler,
  },
}

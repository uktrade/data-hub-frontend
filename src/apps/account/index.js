const router = require('express').Router()

function getHandler (req, res) {
  res.render('myaccount/index', {
    title: 'Your account',
  })
}

module.exports = {
  router: router.get('/myaccount', getHandler),
  controllers: {
    getHandler,
  },
}

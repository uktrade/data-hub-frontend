const router = require('express').Router()

const {
  searchAction,
  viewCompanyResult,
} = require('./controllers')

router.get('/search/:searchPath?', searchAction)

router.get('/viewcompanyresult/:id', viewCompanyResult) // TODO is this in the right controller

module.exports = router

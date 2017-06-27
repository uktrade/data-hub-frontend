const router = require('express').Router()

const {
  indexAction,
  searchAction,
  searchActionValidationSchema,
  viewCompanyResult,
} = require('./controllers')

router.get('/search/:searchType?', searchActionValidationSchema, indexAction, searchAction)

router.get('/viewcompanyresult/:id', viewCompanyResult) // TODO is this in the right controller

module.exports = router

const router = require('express').Router()

const {
  searchAction,
  viewCompanyResult,
  renderSearchResults,
} = require('./controllers')

router.get('/companies', searchAction)
router.get('/:searchPath?', renderSearchResults)

router.get('/viewcompanyresult/:id', viewCompanyResult) // TODO is this in the right controller

module.exports = router

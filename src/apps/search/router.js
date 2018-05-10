const router = require('express').Router()
const queryString = require('qs')

const { ENTITIES } = require('./constants')
const { handleRoutePermissions } = require('../middleware')
const { renderSearchResults } = require('./controllers')

function redirectToCompaniesSearch (req, res) {
  res.redirect(`/search/companies?${queryString.stringify(req.query)}`)
}

router.use(handleRoutePermissions(ENTITIES))

router.get('/', redirectToCompaniesSearch)
router.get('/:searchPath?', renderSearchResults)

module.exports = router

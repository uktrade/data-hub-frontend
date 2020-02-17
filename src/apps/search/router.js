const router = require('express').Router()
const queryString = require('qs')

const urls = require('../../lib/urls')
const { ENTITIES } = require('./constants')
const { handleRoutePermissions } = require('../middleware')
const { renderSearchResults } = require('./controllers')

function redirectToCompaniesSearch(req, res) {
  res.redirect(`/search/companies?${queryString.stringify(req.query)}`)
}

router.use(handleRoutePermissions(ENTITIES))

router.get(urls.search.index.route, redirectToCompaniesSearch)
router.get(urls.search.type.route, renderSearchResults)

module.exports = router

const router = require('express').Router()
const queryString = require('query-string')

const { renderSearchResults } = require('./controllers')

function redirectToCompaniesSearch (req, res) {
  res.redirect(`/search/companies?${queryString.stringify(req.query)}`)
}

router.get('/', redirectToCompaniesSearch)
router.get('/:searchPath?', renderSearchResults)

module.exports = router

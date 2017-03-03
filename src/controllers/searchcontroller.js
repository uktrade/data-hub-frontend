const express = require('express')
const searchService = require('../services/searchservice')
const getPagination = require('../lib/pagination').getPagination

const router = express.Router()

function get (req, res) {
  const filters = Object.assign({}, req.query)
  delete filters.term
  delete filters.page

  if (!req.query.term || req.query.term.length === 0) {
    res.render('search/facet-search', { result: null, pagination: null, params: req.query })
    return
  }

  searchService.search({
    token: req.session.token,
    term: req.query.term,
    page: req.query.page,
    filters
  })
    .then((result) => {
      const pagination = getPagination(req, result)
      res.render('search/facet-search', { result, pagination, params: req.query })
    })
    .catch(error => res.render('error', { error }))
}

router.get('/', get)

module.exports = {
  search: get, router
}

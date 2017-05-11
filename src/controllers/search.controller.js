const express = require('express')
const companyRepository = require('../repositorys/companyrepository')
const { getViewCompanyLink } = require('../services/companyservice')
const searchService = require('../services/searchservice')
const getPagination = require('../lib/pagination').getPagination
const Q = require('q')

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

function viewCompanyResult (req, res, next) {
  if (req.params.source === 'company_companieshousecompany') {
    res.redirect(`/company/view/ch/${req.params.id}`)
  } else {
    Q.spawn(function * () {
      try {
        const company = yield companyRepository.getDitCompany(req.session.token, req.params.id)
        res.redirect(getViewCompanyLink(company))
      } catch (error) {
        next(error)
      }
    })
  }
}

router.get('/search', get)
router.get('/viewcompanyresult/:source/:id', viewCompanyResult)

module.exports = {
  search: get, router, viewCompanyResult
}

const { find } = require('lodash')

const companyRepository = require('../companies/repos')
const { buildCompanyUrl } = require('../companies/services/data')
const { entities, search, buildSearchEntityResultsData } = require('./services')
const { buildPagination } = require('../../lib/pagination')

function searchAction (req, res, next) {
  const searchTerm = req.query.term
  const entity = find(entities, { path: req.params.searchPath })

  if (!entity) {
    return res.render('search/views/index')
  }

  const searchEntity = entity.entity

  search({
    searchEntity,
    searchTerm,
    token: req.session.token,
    page: req.query.page,
  })
    .then((results) => {
      results.pagination = buildPagination(req, results)
      const searchEntityResultsData = buildSearchEntityResultsData(results.aggregations)

      res
        .breadcrumb.add('Search')
        .render(`search/views/results-${searchEntity}`, {
          searchTerm,
          searchEntity,
          searchPath: entity.path,
          searchEntityResultsData,
          results,
        })
    })
    .catch(next)
}

async function viewCompanyResult (req, res, next) {
  try {
    const company = await companyRepository.getDitCompany(req.session.token, req.params.id)
    res.redirect(buildCompanyUrl(company))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  searchAction,
  viewCompanyResult,
}

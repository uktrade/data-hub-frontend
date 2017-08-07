const { get, find } = require('lodash')

const { transformInvestmentProjectToListItem } = require('../investment-projects/transformers')

const companyRepository = require('../companies/repos')
const { buildCompanyUrl } = require('../companies/services/data')
const { entities, search, buildSearchEntityResultsData } = require('./services')
const { buildPagination } = require('../../lib/pagination')

function searchAction (req, res, next) {
  const searchTerm = req.query.term
  const entity = find(entities, { path: req.params.searchPath })

  if (!entity) {
    return res
      .breadcrumb('Search')
      .render('search/views/index')
  }

  const searchEntity = entity.entity

  search({
    searchEntity,
    searchTerm,
    token: req.session.token,
    page: req.query.page,
  })
    .then((results) => {
      results.pagination = buildPagination(req.query, results)
      const searchEntityResultsData = buildSearchEntityResultsData(results.aggregations)

      res
        .breadcrumb('Search')
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

async function renderInvestmentProjects (req, res) {
  const searchTerm = get(req, 'query.term', '').trim()
  const entity = find(entities, { path: 'investment-projects' })
  const searchEntity = entity.entity

  const results = await search({
    searchTerm,
    searchEntity,
    requestBody: req.body,
    token: req.session.token,
    page: req.query.page,
  })
    .then(results => {
      return {
        count: results.count,
        page: results.page,
        aggregations: buildSearchEntityResultsData(results.aggregations),
        pagination: buildPagination(req.query, results),
        items: results.investment_projects.map(transformInvestmentProjectToListItem),
      }
    })

  res
    .breadcrumb('Search', 'companies')
    .breadcrumb('Investments')
    .render('search/views/investment-projects', {
      searchEntity,
      searchPath: entity.path,
      searchTerm,
      results,
      searchEntityResultsData: results.aggregations,
    })
}

module.exports = {
  searchAction,
  viewCompanyResult,
  renderInvestmentProjects,
}

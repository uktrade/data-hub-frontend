const companyRepository = require('../companies/repos')
const { buildCompanyUrl } = require('../companies/services/data')
const { search } = require('./services')
const getPagination = require('../../lib/pagination').getPagination
const Joi = require('joi')
const Celebrate = require('celebrate')

const defaultEntities = [
  {
    entity: 'company',
    text: 'Companies',
    count: 0,
  },
  {
    entity: 'contact',
    text: 'Contacts',
    count: 0,
  },
]

function buildSearchEntityResultsData (apiResponseEntities) {
  return defaultEntities.map((defaultEntity) => {
    return Object.assign(
      {},
      defaultEntity,
      apiResponseEntities.find((apiResponseEntity) => {
        return apiResponseEntity.entity === defaultEntity.entity
      })
    )
  })
}

function indexAction (req, res, next) {
  if (!req.query.term) {
    return res.render('search/index')
  }

  next()
}

const searchActionValidationSchema = Celebrate({
  params: {
    searchType: Joi.string().valid(
      [
        'company',
        'contact',
      ]
    ),
  },
})

function searchAction (req, res, next) {
  const searchType = req.params.searchType
  const searchTerm = req.query.term

  search({
    token: req.session.token,
    searchTerm,
    searchType,
    page: req.query.page,
  })
    .then((results) => {
      const pagination = getPagination(req, results)
      const searchEntityResultsData = buildSearchEntityResultsData(results.aggregations)

      res.render(`search/results-${searchType}`, {
        title: [searchTerm, `Search results`],
        searchTerm,
        searchType,
        searchEntityResultsData,
        results,
        pagination,
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
  indexAction,
  searchAction,
  searchActionValidationSchema,
  viewCompanyResult,
}

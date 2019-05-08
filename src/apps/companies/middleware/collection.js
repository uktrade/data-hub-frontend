const { assign } = require('lodash')

const { getOptions } = require('../../../lib/options')
const { searchLimitedCompanies, searchCompanies } = require('../../../modules/search/services')
const { transformApiResponseToSearchCollection } = require('../../../modules/search/transformers')
const {
  transformCompanyToListItem,
  transformCompaniesHouseToListItem,
} = require('../transformers')
const { ENTITIES } = require('../../search/constants')

async function getNonGlobalHQs (token) {
  const headerquarterTypes = await getOptions(token, 'headquarter-type')
  const filtered = headerquarterTypes.filter(hqType => !hqType.disabled && hqType.label !== 'ghq')
  return [
    ...filtered,
    {
      value: null,
      name: 'Not a hq',
    },
  ]
}

async function getGlobalHQ (token) {
  const headerquarterTypes = await getOptions(token, 'headquarter-type')
  return headerquarterTypes.find(hqType => hqType.label === 'ghq')
}

async function getLimitedCompaniesCollection (req, res, next) {
  const searchTerm = res.locals.searchTerm = req.query.term

  if (!searchTerm) {
    return next()
  }

  try {
    res.locals.results = await searchLimitedCompanies({
      searchTerm,
      token: req.session.token,
      page: req.query.page,
    })
      .then(
        transformApiResponseToSearchCollection(
          { query: req.query },
          ENTITIES,
          transformCompaniesHouseToListItem,
          (item) => {
            return assign({}, item, {
              url: `/companies/add/${item.id}`,
            })
          }
        )
      )

    next()
  } catch (error) {
    next(error)
  }
}

async function getGlobalHQCompaniesCollection (req, res, next) {
  const searchTerm = res.locals.searchTerm = req.query.term
  const { id: companyId } = res.locals.company
  const { token } = req.session

  if (!searchTerm) {
    return next()
  }

  try {
    const globalHQ = await getGlobalHQ(token)

    res.locals.results = await searchCompanies({
      token: req.session.token,
      searchTerm,
      page: req.query.page,
      requestBody: {
        ...req.body,
        headquarter_type: globalHQ.value,
      },
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        ENTITIES,
        transformCompanyToListItem,
        (item) => {
          return {
            ...item,
            url: `/companies/${companyId}/hierarchies/ghq/${item.id}/add`,
          }
        }
      ))

    next()
  } catch (error) {
    next(error)
  }
}

async function getSubsidiaryCompaniesCollection (req, res, next) {
  const searchTerm = res.locals.searchTerm = req.query.term
  const { id: companyId } = res.locals.company
  const { token } = req.session

  if (!searchTerm) {
    return next()
  }

  try {
    const nonGlobalHQs = await getNonGlobalHQs(token)

    res.locals.results = await searchCompanies({
      token: req.session.token,
      searchTerm,
      page: req.query.page,
      requestBody: {
        ...req.body,
        headquarter_type: nonGlobalHQs.map(hqType => hqType.value),
      },
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        ENTITIES,
        transformCompanyToListItem,
        (item) => {
          return {
            ...item,
            url: `/companies/${companyId}/hierarchies/subsidiaries/${item.id}/add`,
          }
        }
      ))

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getLimitedCompaniesCollection,
  getGlobalHQCompaniesCollection,
  getSubsidiaryCompaniesCollection,
}

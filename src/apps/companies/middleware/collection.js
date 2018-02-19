const { pick, pickBy, assign, isNull, get, find, includes, set, flatten, compact } = require('lodash')

const { search, searchLimitedCompanies, searchCompanies } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const {
  transformCompanyToListItem,
  transformCompaniesHouseToListItem,
} = require('../transformers')
const { getDitCompany } = require('../repos')

const addHeadquartersInfo = (response, session) => {
  // add headquarters information onto a subsidiary that has headquarters
  response.results.forEach((company) => {
    session.subsidiaries.forEach((sessionSubsidiary) => {
      if (find(sessionSubsidiary.subs, (subs) => subs.includes(company.id))) {
        set(company, 'headquarters', sessionSubsidiary)
      }
    })
  })

  return response
}

async function getCompanyCollection (req, res, next) {
  const companyTypeQuery = compact(flatten([req.query.company_type]))

  try {
    res.locals.results = await search({
      searchEntity: 'company',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then((response) => addHeadquartersInfo(response, req.session))
      .then((response) => {
        // mimic API filtering of company_type
        if (companyTypeQuery.length) {
          response.results = response.results.filter((company) => {
            if (companyTypeQuery === 'ghq') {
              return includes(companyTypeQuery, get(company, 'headquarter_type.name'))
            } else {
              return includes(companyTypeQuery, get(company, 'headquarter_type.name', 'non'))
            }
          })
          response.count = response.results.length
        }

        return response
      })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformCompanyToListItem,
      ))

    next()
  } catch (error) {
    next(error)
  }
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

async function getSubsidiarySearchCompaniesCollection (req, res, next) {
  const searchTerm = res.locals.searchTerm = req.query.term
  const { id: parentCompanyId } = res.locals.company

  if (!searchTerm) {
    return next()
  }

  try {
    res.locals.results = await searchCompanies({
      searchTerm,
      token: req.session.token,
      page: req.query.page,
    })
      .then((response) => {
        const filteredNonHeadquarters = response.results.filter((company) => {
          // only include non headquarters
          return isNull(company.headquarter_type)
        })

        response.results = filteredNonHeadquarters
        response.count = filteredNonHeadquarters.length

        return response
      })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformCompanyToListItem,
        (company) => {
          return assign({}, company, {
            url: `/companies/${parentCompanyId}/subsidiaries/add/${company.id}`,
          })
        }
      ))

    next()
  } catch (error) {
    next(error)
  }
}

async function getGlobalHQ (req, res, next) {
  try {
    const result = await getDitCompany(req.session.token, req.params.globalHQCompanyId)
    res.locals.globalHQ = result
  } catch (error) {
    next(error)
  }

  next()
}

async function getGlobalHQSearchCompaniesCollection (req, res, next) {
  const searchTerm = res.locals.searchTerm = req.query.term
  const { id: subsidiaryCompanyId } = res.locals.company

  res.locals.inputLabel = 'Search and select the Global HQ'

  if (!searchTerm) {
    return next()
  }

  try {
    res.locals.results = await searchCompanies({
      searchTerm,
      token: req.session.token,
      page: req.query.page,
    })
      .then((response) => {
        const filteredOnlyGlobalHQ = response.results.filter((company) => {
          // only include global headquarters
          return (get(company, 'headquarter_type.name') === 'ghq')
        })

        response.results = filteredOnlyGlobalHQ
        response.count = filteredOnlyGlobalHQ.length

        return response
      })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformCompanyToListItem,
        (company) => {
          return assign({}, company, {
            url: `/companies/${subsidiaryCompanyId}/details/global-headquarters/add/${company.id}`,
          })
        }
      ))

    next()
  } catch (error) {
    next(error)
  }
}

async function getSubsidiaryCompaniesCollection (req, res, next) {
  const companyId = req.params.companyId
  const sessionCompanySubsidiaries = get(find(req.session.subsidiaries, ['id', companyId]), 'subs', [])

  const promises = sessionCompanySubsidiaries.map((id) => {
    return getDitCompany(req.session.token, id)
  })

  // Bit of a mess but only way to mock out the api call
  try {
    res.locals.results = await Promise.all(promises)
      .then((companies) => {
        return {
          count: companies.length,
          results: companies,
          page: req.query.page | 1,
          limit: 10,
        }
      })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformCompanyToListItem,
      ))

    next()
  } catch (error) {
    next(error)
  }
}

function getRequestBody (req, res, next) {
  const selectedFiltersQuery = pick(req.query, [
    'name',
    'sector',
    'country',
    'uk_region',
  ])

  const selectedSortBy = req.query.sortby ? {
    sortby: req.query.sortby,
  } : null

  req.body = assign({}, req.body, selectedSortBy, pickBy(selectedFiltersQuery))

  next()
}

module.exports = {
  getRequestBody,
  getCompanyCollection,
  getLimitedCompaniesCollection,
  getSubsidiaryCompaniesCollection,
  getSubsidiarySearchCompaniesCollection,
  getGlobalHQSearchCompaniesCollection,
  getGlobalHQ,
}

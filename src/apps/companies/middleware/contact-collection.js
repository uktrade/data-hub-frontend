const { get, assign, reject, pick, pickBy } = require('lodash')

const { search } = require('../../../modules/search/services')
const {
  transformApiResponseToCollection,
} = require('../../../modules/api/transformers')
const { transformContactToListItem } = require('../../contacts/transformers')
const removeArray = require('../../../lib/remove-array')

async function getCompanyContactCollection(req, res, next) {
  try {
    res.locals.contactResults = await search({
      req,
      searchEntity: 'contact',
      requestBody: req.body,
      page: req.query.page,
      isAggregation: false,
    }).then(
      transformApiResponseToCollection(
        { query: req.query },
        transformContactToListItem,
        (contact) => {
          const meta = reject(contact.meta, ['label', 'Company'])
          return assign({}, contact, { meta })
        }
      )
    )

    next()
  } catch (error) {
    next(error)
  }
}

function setCompanyContactRequestBody(req, res, next) {
  const requestParams = {
    company: get(req.params, 'companyId'),
  }
  const selectedFiltersQuery = removeArray(
    pick(req.query, [
      'archived',
      'name',
      'company_sector',
      'address_country',
      'company_uk_region',
    ]),
    'archived'
  )

  const selectedSortBy = req.query.sortby ? { sortby: req.query.sortby } : null

  req.body = assign(
    {},
    req.body,
    selectedSortBy,
    pickBy(selectedFiltersQuery),
    requestParams
  )

  next()
}

module.exports = {
  setCompanyContactRequestBody,
  getCompanyContactCollection,
}

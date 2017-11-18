const {
  get,
  assign,
  reject,
  pick,
  mapValues,
  isArray,
  pickBy,
} = require('lodash')

const { search } = require('../../search/services')
const { transformApiResponseToCollection } = require('../../transformers')
const { transformContactToListItem } = require('../../contacts/transformers')

async function getCompanyContactCollection (req, res, next) {
  try {
    res.locals.contactResults = await search({
      searchEntity: 'contact',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(
        transformApiResponseToCollection(
          { query: req.query },
          transformContactToListItem,
          (contact) => {
            const meta = reject(contact.meta, ['label', 'Company'])
            return Object.assign({}, contact, { meta })
          }
        )
      )

    next()
  } catch (error) {
    next(error)
  }
}

function getCompanyContactRequestBody (req, res, next) {
  const requestParams = {
    company: get(req.params, 'companyId'),
  }
  const selectedFiltersQuery = mapValues(pick(req.query, 'archived'), (value) => {
    return isArray(value) ? null : value
  })

  const selectedSortBy = req.query.sortby
    ? { sortby: req.query.sortby }
    : null

  req.body = assign({}, req.body, selectedSortBy, pickBy(selectedFiltersQuery), requestParams)

  next()
}

module.exports = {
  getCompanyContactRequestBody,
  getCompanyContactCollection,
}

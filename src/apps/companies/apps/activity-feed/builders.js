const { forEach, isArray } = require('lodash')

function buildActivityFeedFilters (companyId, filter) {
  const query = [
    { term: { 'object.attributedTo.id': `dit:DataHubCompany:${companyId}` } },
  ]

  if (isArray(filter)) {
    forEach(filter, (item) => {
      query.push(buildFilter(item))
    })
  } else {
    query.push(buildFilter(filter))
  }

  return query
}

function buildFilter (item = '') {
  const terms = JSON.parse(item)

  return { terms }
}

module.exports = {
  buildActivityFeedFilters,
}

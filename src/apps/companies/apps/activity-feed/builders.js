const config = require('../../../../config')
const { ACTIVITY_TYPE_FILTERS, ACTIVITY_TYPE_FILTER_KEYS, ACTIVITY_TYPE_FILTER_OBJECT } = require('../../constants')

function terms (key, value) {
  return {
    terms: {
      [key]: value,
    },
  }
}

function buildActivityFeedFilters (companyId, filter = {}) {
  const query = [
    { term: { 'object.attributedTo.id': `dit:DataHubCompany:${companyId}` } },
  ]

  if (Array.isArray(filter)) {
    filter.forEach((item) => {
      query.push(item)
    })
  } else {
    query.push(filter)
  }

  return query
}

function buildEsFilterQuery (queryParams = '', user) {
  const { allActivity, dataHubActivity, externalActivity } = ACTIVITY_TYPE_FILTER_KEYS

  switch (queryParams) {
    case ACTIVITY_TYPE_FILTERS.allActivity.value:
      return terms(ACTIVITY_TYPE_FILTER_OBJECT.TYPE, allActivity)
    case ACTIVITY_TYPE_FILTERS.myActivity.value:
      return terms(ACTIVITY_TYPE_FILTER_OBJECT.ATTRIBUTED_TO_ID, [`dit:DataHubAdviser:${user.id}`])
    case ACTIVITY_TYPE_FILTERS.dataHubActivity.value:
      return terms(ACTIVITY_TYPE_FILTER_OBJECT.TYPE, dataHubActivity)
    case ACTIVITY_TYPE_FILTERS.externalActivity.value:
      return terms(ACTIVITY_TYPE_FILTER_OBJECT.TYPE, externalActivity)
    default:
      return terms(ACTIVITY_TYPE_FILTER_OBJECT.TYPE, config.activityFeed.supportedActivityTypes)
  }
}

module.exports = {
  buildActivityFeedFilters,
  buildEsFilterQuery,
}

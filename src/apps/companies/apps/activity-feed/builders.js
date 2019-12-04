const bodybuilder = require('bodybuilder')

const {
  FILTER_KEYS,
  ES_KEYS_GROUPED,
} = require('./constants')

const {
  allActivity,
  externalActivity,
  dataHubActivity,
} = ES_KEYS_GROUPED

const FILTER_KEY_MAP = {
  [FILTER_KEYS.allActivity]: allActivity,
  [FILTER_KEYS.externalActivity]: externalActivity,
  [FILTER_KEYS.dataHubActivity]: dataHubActivity,
}

function createESFilters (activityTypeFilter, dnbHierarchyIds = [], company, user, from, size) {
  const types = FILTER_KEY_MAP[activityTypeFilter] || FILTER_KEY_MAP[FILTER_KEYS.dataHubActivity]

  const body = bodybuilder()
    .from(from)
    .size(size)
    .sort('object.startTime', 'desc')

  // Add the types
  body.filter('terms', 'object.type', types)

  // My activity
  if (activityTypeFilter === FILTER_KEYS.myActivity) {
    body.filter('term', 'object.attributedTo.id', `dit:DataHubAdviser:${user.id}`)
  }

  // DnB Hierarchy IDs and Data Hub Company ID
  if (dnbHierarchyIds.length) {
    const ids = dnbHierarchyIds.map((id) => `dit:DataHubCompany:${id}`)
    ids.push(`dit:DataHubCompany:${company.id}`)
    body.filter('terms', 'object.attributedTo.id', ids)
  } else {
    body.filter('term', 'object.attributedTo.id', `dit:DataHubCompany:${company.id}`)
  }

  return body.build()
}

module.exports = {
  createESFilters,
}

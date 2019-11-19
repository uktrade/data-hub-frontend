const {
  FILTER_KEYS,
  ES_KEYS,
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
  [FILTER_KEYS.myActivity]: dataHubActivity,
  [FILTER_KEYS.dataHubActivity]: dataHubActivity,
}

function createESFilters (activityTypeFilter, ultimateHQSubsidiaryIds = [], company, user) {
  const types = FILTER_KEY_MAP[activityTypeFilter] || FILTER_KEY_MAP[FILTER_KEYS.dataHubActivity]

  const attributedToIds = [`dit:DataHubCompany:${company.id}`]
  if (activityTypeFilter === FILTER_KEYS.myActivity) {
    attributedToIds.push(`dit:DataHubAdviser:${user.id}`)
  }

  if (ultimateHQSubsidiaryIds.length) {
    ultimateHQSubsidiaryIds.forEach((id) => attributedToIds.push(`dit:DataHubCompany:${id}`))
  }

  return [
    {
      terms: {
        [ES_KEYS.type]: types,
      },
    },
    {
      terms: {
        [ES_KEYS.attributedTo]: attributedToIds,
      },
    },
  ]
}

module.exports = {
  createESFilters,
}

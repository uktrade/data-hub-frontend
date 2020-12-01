const {
  FILTER_KEYS,
  DATA_HUB_ACTIVITY,
  EXTERNAL_ACTIVITY,
  DATA_HUB_AND_EXTERNAL_ACTIVITY,
} = require('./constants')

const {
  myActivity,
  dataHubActivity,
  externalActivity,
} = require('./es-queries')

const createESFilter = (activityTypeFilter, opts) => {
  const filters = {
    [FILTER_KEYS.myActivity]: myActivity(opts, DATA_HUB_ACTIVITY),
    [FILTER_KEYS.dataHubActivity]: dataHubActivity(opts, DATA_HUB_ACTIVITY),
    [FILTER_KEYS.externalActivity]: externalActivity(opts, EXTERNAL_ACTIVITY),
    [FILTER_KEYS.dataHubAndExternalActivity]: externalActivity(
      opts,
      DATA_HUB_AND_EXTERNAL_ACTIVITY
    ),
  }

  return filters[activityTypeFilter] || filters[FILTER_KEYS.dataHubActivity]
}

module.exports = createESFilter

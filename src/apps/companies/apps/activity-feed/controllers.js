const { FILTER_ITEMS, FILTER_KEYS } = require('./constants')
const { getGlobalUltimateHierarchy } = require('../../repos')
const { companies } = require('../../../../lib/urls')
const { createESFilters } = require('./builders')
const { fetchActivityFeed } = require('./repos')
const config = require('../../../../config')

async function renderActivityFeed (req, res, next) {
  const { company, features, dnbHierarchyCount } = res.locals

  try {
    const contentProps = company.archived ? {} : {
      contentText: 'Add interaction',
      contentLink: companies.interactions.create(company.id),
      activityTypeFilter: FILTER_KEYS.dataHubActivity,
      activityTypeFilters: FILTER_ITEMS,
      isGlobalUltimate: company.is_global_ultimate,
      isTypeFilterFlagEnabled: features['activity-feed-type-filter-enabled'],
      isGlobalUltimateFlagEnabled: features['companies-ultimate-hq'],
    }

    const props = {
      ...contentProps,
      apiEndpoint: companies.activity.data(company.id),

      // TODO: Fix typo on the ActivityFeedApp component.
      dnbHierachyCount: dnbHierarchyCount,
    }

    res
      .breadcrumb(company.name, companies.detail(company.id))
      .breadcrumb('Activity Feed')
      .render('companies/apps/activity-feed/views/client-container', { props })
  } catch (error) {
    next(error)
  }
}

async function fetchActivityFeedHandler (req, res, next) {
  try {
    const { token } = req.session
    const { company, user } = res.locals
    const {
      from = 0,
      size = config.activityFeed.paginationSize,
      activityTypeFilter = FILTER_KEYS.dataHubActivity,
      showDnbHierarchy = false,
    } = req.query

    let dnbHierarchyIds = []
    if (company.is_global_ultimate && showDnbHierarchy) {
      const { results } = await getGlobalUltimateHierarchy(token, company.global_ultimate_duns_number)
      dnbHierarchyIds = results.filter((company) => !company.is_global_ultimate).map((company) => company.id)
    }

    const results = await fetchActivityFeed({
      token: req.session.token,
      body: createESFilters(activityTypeFilter, dnbHierarchyIds, company, user, from, size),
    })

    res.json(results)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderActivityFeed,
  fetchActivityFeedHandler,
}

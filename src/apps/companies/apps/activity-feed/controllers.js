const {
  FILTER_ITEMS,
  FILTER_KEYS,
  DATA_HUB_ACTIVITY,
  EXTERNAL_ACTIVITY,
  DATA_HUB_AND_EXTERNAL_ACTIVITY,
} = require('./constants')

const { getGlobalUltimateHierarchy } = require('../../repos')
const urls = require('../../../../lib/urls')
const { fetchActivityFeed } = require('./repos')
const config = require('../../../../config')

const {
  myActivity,
  dataHubActivity,
  externalActivity,
} = require('./es-queries')

async function renderActivityFeed(req, res, next) {
  const {
    company,
    features,
    dnbHierarchyCount,
    dnbRelatedCompaniesCount,
  } = res.locals

  const breadcrumbs = [
    { link: urls.dashboard(), text: 'Home' },
    { link: urls.companies.index(), text: 'Companies' },
    { link: urls.companies.detail(company.id), text: company.name },
    { text: 'Activity Feed' },
  ]

  try {
    const contentProps = company.archived
      ? {
          company,
          breadcrumbs,
          flashMessages: res.locals.getMessages(),
        }
      : {
          company,
          breadcrumbs,
          hasActivityFeedWarning: !!res.locals.features[
            'activity-feed-display-incomplete-message'
          ],
          flashMessages: res.locals.getMessages(),
          activityTypeFilter: FILTER_KEYS.dataHubActivity,
          activityTypeFilters: FILTER_ITEMS,
          isGlobalUltimate: company.is_global_ultimate,
          dnbHierarchyCount,
          dnbRelatedCompaniesCount,
          isTypeFilterFlagEnabled:
            features['activity-feed-type-filter-enabled'],
          isGlobalUltimateFlagEnabled: features['companies-ultimate-hq'],
          showMatchingPrompt:
            features['companies-matching'] &&
            !company.duns_number &&
            !company.pending_dnb_investigation,
        }

    const props = {
      ...contentProps,
      apiEndpoint: urls.companies.activity.data(company.id),
    }

    res.render('companies/apps/activity-feed/views/client-container', { props })
  } catch (error) {
    next(error)
  }
}

function getQueries(options, isExportEnquiriesEnabled) {
  return {
    [FILTER_KEYS.myActivity]: myActivity({
      ...options,
      types: DATA_HUB_ACTIVITY,
    }),
    [FILTER_KEYS.dataHubActivity]: dataHubActivity({
      ...options,
      types: DATA_HUB_ACTIVITY,
    }),
    [FILTER_KEYS.externalActivity]: externalActivity(
      {
        ...options,
        types: EXTERNAL_ACTIVITY,
      },
      isExportEnquiriesEnabled
    ),
    [FILTER_KEYS.dataHubAndExternalActivity]: externalActivity(
      {
        ...options,
        types: DATA_HUB_AND_EXTERNAL_ACTIVITY,
      },
      isExportEnquiriesEnabled
    ),
  }
}

async function fetchActivityFeedHandler(req, res, next) {
  try {
    const { company, user, features } = res.locals
    const {
      from = 0,
      size = config.activityFeed.paginationSize,
      activityTypeFilter = FILTER_KEYS.dataHubActivity,
      showDnbHierarchy = false,
    } = req.query

    let dnbHierarchyIds = []
    if (company.is_global_ultimate && showDnbHierarchy) {
      const { results } = await getGlobalUltimateHierarchy(
        req,
        company.global_ultimate_duns_number
      )
      dnbHierarchyIds = results
        .filter((company) => !company.is_global_ultimate)
        .map((company) => company.id)
    }

    const queries = getQueries(
      {
        from,
        size,
        companyIds: [company.id, ...dnbHierarchyIds],
        contacts: company.contacts,
        user,
      },
      features['activity-feed-export-enquiry']
    )

    const results = await fetchActivityFeed(
      req,
      queries[activityTypeFilter] || queries[FILTER_KEYS.dataHubActivity]
    )

    res.json(results)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderActivityFeed,
  fetchActivityFeedHandler,
}

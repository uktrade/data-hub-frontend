const { FILTER_ITEMS, FILTER_KEYS } = require('./constants')
const { getGlobalUltimateHierarchy } = require('../../repos')
const urls = require('../../../../lib/urls')
const createESFilter = require('./builders')
const { fetchActivityFeed } = require('./repos')
const config = require('../../../../config')

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
          isExportEnquiriesEnabled: features['activity-feed-export-enquiry'],
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

async function fetchActivityFeedHandler(req, res, next) {
  try {
    const { company, user } = res.locals
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

    const options = {
      from,
      size,
      companyIds: [company.id, ...dnbHierarchyIds],
      contacts: company.contacts,
      user,
    }

    const results = await fetchActivityFeed(
      req,
      createESFilter(activityTypeFilter, options)
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

const { ACTIVITY_TYPE_FILTERS } = require('../../constants')
const { fetchActivityFeed } = require('./repos')
const { buildEsFilterQuery } = require('./builders')
const { getUltimateHQSubsidiaries } = require('../../repos')
const { companies } = require('../../../../lib/urls')

async function renderActivityFeed (req, res, next) {
  const { allActivity, dataHubActivity, externalActivity, myActivity } = ACTIVITY_TYPE_FILTERS
  const { company, features } = res.locals
  const { token } = req.session

  const addActivityTypeFilter = {
    allActivity,
    myActivity,
    externalActivity,
    dataHubActivity,
  }

  try {
    const addContentProps = company.archived ? {} : {
      addContentText: 'Add interaction',
      addContentLink: companies.interactions.create(company.id),
      addActivityTypeFilter,
      isTypeFilterEnabled: features['activity-feed-type-filter-enabled'],
    }

    const props = {
      ...addContentProps,
      apiEndpoint: companies.activity.data(company.id),
    }

    if (company.is_global_ultimate) {
      const subsidiaries = await getUltimateHQSubsidiaries(token, company.global_ultimate_duns_number)
      // Substract the Utlimate HQ from the count
      props.subsidiaryCount = subsidiaries.results.length - 1
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
    const { company, user } = res.locals
    const { from = 0, queryParams = {} } = req.query

    const results = await fetchActivityFeed({
      token: req.session.token,
      from,
      companyId: company.id,
      filter: buildEsFilterQuery(queryParams, user),
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

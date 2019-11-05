const { ACTIVITY_TYPE_FILTERS } = require('../../constants')
const { fetchActivityFeed } = require('./repos')
const { buildEsFilterQuery } = require('./builders')

async function renderActivityFeed (req, res, next) {
  const { allActivity, dataHubActivity, externalActivity, myActivity } = ACTIVITY_TYPE_FILTERS
  const { company, features } = res.locals

  const addActivityTypeFilter = {
    allActivity,
    myActivity,
    externalActivity,
    dataHubActivity,
  }

  try {
    const addContentProps = company.archived ? {} : {
      addContentText: 'Add interaction',
      addContentLink: `/companies/${company.id}/interactions/create`,
      addActivityTypeFilter,
      isTypeFilterEnabled: features['activity-feed-type-filter-enabled'],
    }

    res
      .breadcrumb(company.name, `/companies/${company.id}`)
      .breadcrumb('Activity Feed')
      .render('companies/apps/activity-feed/views/client-container', {
        props: {
          ...addContentProps,
          apiEndpoint: `/companies/${company.id}/activity/data`,
        },
      })
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

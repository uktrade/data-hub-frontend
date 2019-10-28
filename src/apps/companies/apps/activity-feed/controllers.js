const { ACTIVITY_TYPE_FILTERS } = require('../../constants')
const { fetchActivityFeed } = require('./repos')

async function renderActivityFeed (req, res, next) {
  const { company, features, user } = res.locals

  const addActivityTypeFilter = {
    values: [
      ACTIVITY_TYPE_FILTERS.all,
      {
        label: 'My activity',
        value: `dit:DataHubAdviser:${user.id}`,
      },
      ACTIVITY_TYPE_FILTERS.dataHubActivity,
      ACTIVITY_TYPE_FILTERS.externalActivity,
    ],
    default: ACTIVITY_TYPE_FILTERS.dataHubActivity,
  }

  try {
    const addContentProps = company.archived ? {} : {
      addContentText: 'Add interaction',
      addContentLink: `/companies/${company.id}/interactions/create`,
      addActivityTypeFilter,
      isFilterEnabled: features['activity-feed-filters'],
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
    const { company } = res.locals
    const { from = 0, queryParams = {} } = req.query

    const results = await fetchActivityFeed({
      token: req.session.token,
      from,
      companyId: company.id,
      filter: queryParams,
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

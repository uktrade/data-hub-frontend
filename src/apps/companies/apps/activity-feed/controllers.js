import { ACTIVITY_TYPE_FILTERS } from '../../constants'
const { fetchActivityFeed } = require('./repos')

async function renderActivityFeed (req, res, next) {
  const { company, features } = res.locals
  try {
    const addContentProps = company.archived ? {} : {
      addContentText: 'Add interaction',
      addContentLink: `/companies/${company.id}/interactions/create`,
      addActivityTypeFilter: {
        values: [
          ACTIVITY_TYPE_FILTERS.all,
          {
            label: 'My activity',
            value: '123', // TODO(jf): get res.locals.whoamI.userId
          },
          ACTIVITY_TYPE_FILTERS.dataHubActivity,
          ACTIVITY_TYPE_FILTERS.externalActivity,
        ],
        defaultValue: ACTIVITY_TYPE_FILTERS.dataHubActivity.value,
      },
      isFilterEnabled: !!features['activity-type-filter'], // TODO(jf): set this feature flag
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
    const { from = 0 } = req.query

    const results = await fetchActivityFeed({
      token: req.session.token,
      from,
      companyId: company.id,
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

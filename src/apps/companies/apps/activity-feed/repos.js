const config = require('../../../../config')
const { authorisedRequest } = require('../../../../lib/authorised-request')
const { buildActivityFeedFilters } = require('./builders')

function fetchActivityFeed ({
  token,
  size = config.activityFeed.paginationSize,
  from = 0,
  companyId,
  filter = '',
}) {
  const requestBody = {
    size,
    from,
    sort: {
      'object.startTime': 'desc',
    },
    query: {
      bool: {
        filter: buildActivityFeedFilters(companyId, filter),
      },
    },
  }

  return authorisedRequest(token, {
    url: `${config.apiRoot}/v4/activity-feed`,
    body: requestBody,
  })
}

module.exports = {
  fetchActivityFeed,
}

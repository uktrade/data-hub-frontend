const config = require('../../../../../config')
const { authorisedRequest } = require('../../../../lib/authorised-request')

function fetchActivityFeed ({
  token,
  size = config.activityFeed.paginationSize,
  from = 0,
  companyId,
}) {
  const requestBody = {
    size,
    from,
    sort: {
      'object.startTime': 'desc',
    },
    query: {
      bool: {
        filter: [
          { term: { 'object.attributedTo.id': `dit:DataHubCompany:${companyId}` } },
        ],
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

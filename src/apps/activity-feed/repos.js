const { set } = require('lodash')
const config = require('../../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

async function fetchActivityFeed ({
  token,
  size = config.activityFeed.paginationSize,
  from = 0,
  companyId = null,
}) {
  const requestBody = {
    size,
    from,
    sort: {
      published: 'desc',
    },
  }

  if (companyId) {
    set(requestBody, 'query.bool.filter.term["object.attributedTo.id"]', `dit:DataHubCompany:${companyId}`)
  }

  const { hits } = await authorisedRequest(token, {
    url: `${config.apiRoot}/v4/activity-feed`,
    body: requestBody,
  })

  return hits
}

module.exports = {
  fetchActivityFeed,
}

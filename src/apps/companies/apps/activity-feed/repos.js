const config = require('../../../../config')
const { authorisedRequest } = require('../../../../lib/authorised-request')

function fetchActivityFeed ({
  token,
  from,
  size,
  filter,
}) {
  const requestBody = {
    size,
    from,
    query: {
      bool: {
        filter,
      },
    },
    sort: {
      'object.startTime': 'desc',
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

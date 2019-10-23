/* eslint-disable camelcase */
const moment = require('moment')

function transformLargeCapitalProfiles ({
  investor_company,
  created_on,
}) {
  return {
    headingText: investor_company.name,
    headingUrl: `/companies/${investor_company.id}`,
    itemId: investor_company.id,
    metadata: [
      {
        label: 'Updated on',
        value: moment(created_on).format('D MMMM YYYY'),
      },
    ],
  }
}

module.exports = { transformLargeCapitalProfiles }

/* eslint-disable camelcase */
const { format, parseISO } = require('date-fns')
const { companies } = require('../../../lib/urls')

const { DATE_LONG_FORMAT } = require('../../../common/constants')

function transformLargeCapitalProfiles({ investor_company, created_on }) {
  return {
    headingText: investor_company.name,
    headingUrl: companies.investments.largeCapitalProfile(investor_company.id),
    itemId: investor_company.id,
    metadata: [
      {
        label: 'Updated on',
        value: format(new Date(parseISO(created_on)), DATE_LONG_FORMAT),
      },
    ],
  }
}

module.exports = { transformLargeCapitalProfiles }

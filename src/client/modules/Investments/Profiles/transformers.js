/* eslint-disable camelcase */
import { companies } from '../../../../lib/urls'

const { formatDate, DATE_FORMAT_COMPACT } = require('../../../utils/date-utils')

const transformLargeCapitalProfiles = ({ investor_company, created_on }) => ({
  headingText: investor_company.name,
  headingUrl: companies.investments.largeCapitalProfile(investor_company.id),
  id: investor_company.id,
  metadata: [
    {
      label: 'Updated on',
      value: formatDate(created_on, DATE_FORMAT_COMPACT),
    },
  ],
})

export default transformLargeCapitalProfiles

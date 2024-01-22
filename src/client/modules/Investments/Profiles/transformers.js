/* eslint-disable camelcase */
import { companies } from '../../../../lib/urls'

const { format } = require('../../../utils/date')

const transformLargeCapitalProfiles = ({ investor_company, created_on }) => ({
  headingText: investor_company.name,
  headingUrl: companies.investments.largeCapitalProfile(investor_company.id),
  id: investor_company.id,
  metadata: [
    {
      label: 'Updated on',
      value: format(created_on),
    },
  ],
})

export default transformLargeCapitalProfiles

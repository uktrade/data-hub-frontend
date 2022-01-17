/* eslint camelcase: 0 */
const {
  format,
  formatMediumDateTime,
} = require('../../../../client/utils/date')

import urls from '../../../../lib/urls'
import { addressToString } from '../../../../client/utils/addresses'

export const transformInvestmentProjectToListItem = ({
  id,
  name,
  project_code,
  stage,
  investment_type,
  status,
  investor_company,
  estimated_land_date,
  sector,
}) => {
  const badges = [
    { text: stage.name },
    { text: investment_type.name },
    { text: status },
  ]

  const metadata = [
    { label: 'Investor', value: investor_company.name },
    { label: 'Sector', value: sector ? sector.name : '' },
    {
      label: 'Estimated land date',
      value: estimated_land_date && format(estimated_land_date, 'MMMM yyyy'),
    },
  ].filter((metadata) => metadata.value)

  return {
    id,
    headingUrl: urls.investments.projects.details(id),
    headingText: name,
    subheading: `Project code ${project_code}`,
    badges,
    metadata,
  }
}

export const transformCompanyToListItem = (company) => {
  return {
    id: company.id,
    heading: company.name,
    data: { ...company },
    meta: [
      {
        label: 'Updated on',
        value: formatMediumDateTime(company.modified_on),
      },
      {
        label: 'Company address',
        value: addressToString(company.address),
      },
      {
        label: 'Global HQ',
        value: company.global_headquarters?.name,
      },
      {
        label: 'Last interaction date',
        value: company.latest_interaction_date,
      },
    ].filter((meta) => meta.value),
  }
}

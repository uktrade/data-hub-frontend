/* eslint camelcase: 0 */
const {
  format,
  formatMediumDateTime,
  formatMonthYearDate,
} = require('../../../../client/utils/date')

const urls = require('../../../../lib/urls')

const { addressToString } = require('../../../../client/utils/addresses')

const MONTH_DATE_FIELD_LIST = [
  'estimated_land_date_before',
  'estimated_land_date_after',
  'actual_land_date_before',
  'actual_land_date_after',
]

const transformLandDateFilters = (params) => {
  // The API only accepts yyyy-MM-dd format, so month-year filters have to be updated
  MONTH_DATE_FIELD_LIST.forEach((field) => {
    if (field in params) {
      params[field] = formatMonthYearDate(params[field])
    }
  })
  return params
}

const transformInvestmentProjectToListItem = ({
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

const transformCompanyToListItem = (company) => ({
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
})

module.exports = {
  transformLandDateFilters,
  transformInvestmentProjectToListItem,
  transformCompanyToListItem,
}

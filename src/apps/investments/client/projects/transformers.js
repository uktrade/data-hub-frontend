const {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} = require('../../../../client/utils/date-utils')

const { addressToString } = require('../../../../client/utils/addresses')

const transformCompanyToListItem = (company) => ({
  id: company.id,
  heading: company.name,
  data: { ...company },
  meta: [
    {
      label: 'Updated on',
      value: formatDate(company.modified_on, DATE_FORMAT_MEDIUM_WITH_TIME),
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
  transformCompanyToListItem,
}

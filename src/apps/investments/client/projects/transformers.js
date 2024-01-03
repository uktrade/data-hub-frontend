const { formatMediumDateTime } = require('../../../../client/utils/date')

const { addressToString } = require('../../../../client/utils/addresses')

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
  transformCompanyToListItem,
}

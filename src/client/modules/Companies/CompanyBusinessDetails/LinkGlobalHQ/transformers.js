import { get } from 'lodash'

import labels from '../../CollectionList/labels'
import urls from '../../../../../lib/urls'

import { addressToString } from '../../../../utils/addresses'

const { format, formatMediumDateTime } = require('../../../../utils/date')

const transformGlobalHQToListItem = (childCompanyId) => (company) => {
  const {
    id,
    name,
    sector,
    uk_region,
    trading_names,
    address,
    modified_on,
    latest_interaction_date,
    company_number,
  } = company

  const metadata = [
    {
      label: 'Sector',
      value: get(sector, 'name'),
    },
    { label: 'Company number', value: company_number },
    {
      label: labels.address.companyAddress,
      value: addressToString(address),
    },
  ]

  if (trading_names && trading_names.length) {
    metadata.push({
      label: labels.hqLabels.trading_names,
      value: trading_names.join(', '),
    })
  }

  if (latest_interaction_date) {
    metadata.push({
      label: 'Last interaction date',
      value: format(latest_interaction_date),
    })
  }

  const badges = [
    { text: get(address, 'country.name') },
    { text: get(uk_region, 'name') },
  ].filter((item) => item.text)

  return {
    id,
    subheading: modified_on
      ? `Updated on ${formatMediumDateTime(modified_on)}`
      : undefined,
    headingText: name,
    headingUrl: urls.companies.hierarchies.ghq.add(childCompanyId, id),
    badges,
    metadata: metadata.filter((item) => item.value),
  }
}

const transformResponseToGlobalHQCollection = (
  childCompanyId,
  { count, results = [] }
) => ({
  count,
  results: results.map(transformGlobalHQToListItem(childCompanyId)),
})

export { transformResponseToGlobalHQCollection }

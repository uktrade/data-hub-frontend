import { get } from 'lodash'

import labels from '../../CollectionList/labels'
import urls from '../../../../../lib/urls'

import { addressToString } from '../../../../utils/addresses'

const { format } = require('../../../../utils/date')
const {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} = require('../../../../utils/date-utils')

const isGlobalHQ = (hqId) => hqId == '43281c5e-92a4-4794-867b-b4d5f801e6f3'

const buildUrl = (id, parentCompanyId, headquarter_type) =>
  isGlobalHQ(headquarter_type?.id)
    ? ''
    : urls.companies.hierarchies.subsidiaries.add(parentCompanyId, id)

const transformSubsidiaryToListItem = (parentCompanyId) => (company) => {
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
    headquarter_type,
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

  if (headquarter_type) {
    metadata.push({
      label: 'Headquarter type',
      value: labels.hqLabels[get(headquarter_type, 'name')],
    })
  }

  const badges = [
    { text: get(address, 'country.name') },
    { text: get(uk_region, 'name') },
    { text: labels.hqLabels[get(headquarter_type, 'name')] },
  ].filter((item) => item.text)

  return {
    id,
    subheading: modified_on
      ? `Updated on ${formatDate(modified_on, DATE_FORMAT_MEDIUM_WITH_TIME)}`
      : undefined,
    headingText: name,
    headingUrl: buildUrl(id, parentCompanyId, headquarter_type),
    badges,
    metadata: isGlobalHQ(headquarter_type?.id)
      ? [
          {
            label: '',
            value:
              'It is not possible to add a Global HQ as a subsidiary of another company.',
          },
        ]
      : metadata.filter((item) => item.value),
  }
}

const transformResponseToSubsidiaryCollection = (
  parentCompanyId,
  { count, results = [] }
) => ({
  count,
  results: results.map(transformSubsidiaryToListItem(parentCompanyId)),
})

export { transformResponseToSubsidiaryCollection }

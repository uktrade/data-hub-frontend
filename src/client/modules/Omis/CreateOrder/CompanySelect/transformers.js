import { get } from 'lodash'

import labels from '../../../Companies/CollectionList/labels'
import urls from '../../../../../lib/urls'

import { addressToString } from '../../../../utils/addresses'

const {
  formatDate,
  DATE_FORMAT_COMPACT,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} = require('../../../../utils/date-utils')

const transformCompanyToListItem = ({
  id,
  name,
  sector,
  uk_region,
  trading_names,
  address,
  modified_on,
  headquarter_type,
  global_headquarters,
  latest_interaction_date,
} = {}) => {
  const metadata = [
    {
      label: 'Sector',
      value: get(sector, 'name'),
    },
    {
      label: 'Global HQ',
      value: get(global_headquarters, 'name'),
    },
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
      value: formatDate(latest_interaction_date, DATE_FORMAT_COMPACT),
    })
  }

  if (headquarter_type) {
    metadata.push({
      label: 'Headquarter type',
      value: labels.hqLabels[get(headquarter_type, 'name')],
    })
  }

  const badges = [{ text: labels.hqLabels[get(headquarter_type, 'name')] }]

  if (uk_region) {
    badges.push({ text: `${get(uk_region, 'name')}, UK` })
  } else {
    badges.push({ text: get(address, 'country.name') })
  }
  const filteredBadges = badges.filter((item) => item.text)

  return {
    id,
    subheading: modified_on
      ? `Updated on ${formatDate(modified_on, DATE_FORMAT_MEDIUM_WITH_TIME)}`
      : undefined,
    headingText: name,
    headingUrl: urls.omis.create.form(id),
    badges: filteredBadges,
    metadata: metadata.filter((item) => item.value),
  }
}

const transformResponseToCompanyCollection = ({ count, results = [] }) => ({
  count,
  results: results.map(transformCompanyToListItem),
})

export { transformResponseToCompanyCollection }

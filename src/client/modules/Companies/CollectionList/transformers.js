import { get } from 'lodash'

import labels from './labels'
import urls from '../../../../lib/urls'
import { addressToString } from '../../../utils/addresses'

const {
  formatDate,
  DATE_FORMAT_COMPACT,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} = require('../../../utils/date-utils')

export const transformCheckBoxGroupToApi = (queryParam) => {
  const param = Array.isArray(queryParam)
    ? queryParam
    : queryParam && [queryParam]
  return param?.length === 1 ? param[0] === 'true' : undefined
}

export const transformPostcodeToApi = (postcode) =>
  postcode && postcode.split(',').map((postcode) => postcode.trim())

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

  const tags = [
    { text: labels.hqLabels[get(headquarter_type, 'name')], colour: 'grey' },
  ]

  if (uk_region) {
    tags.push({ text: `${get(uk_region, 'name')}, UK`, colour: 'blue' })
  } else {
    tags.push({ text: get(address, 'country.name'), colour: 'blue' })
  }
  const filteredTags = tags.filter((item) => item.text)

  return {
    id,
    subheading: modified_on
      ? `Updated on ${formatDate(modified_on, DATE_FORMAT_MEDIUM_WITH_TIME)}`
      : undefined,
    headingText: name,
    headingUrl: urls.companies.detail(id),
    badges: filteredTags,
    tags: filteredTags,
    metadata: metadata.filter((item) => item.value),
  }
}

const transformResponseToCompanyCollection = ({ count, results = [] }) => ({
  count,
  results: results.map(transformCompanyToListItem),
})

export { transformResponseToCompanyCollection }

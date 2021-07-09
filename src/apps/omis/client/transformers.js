import { find } from 'lodash'

import { format, formatWithTime } from '../../../client/utils/date-utils'
import { STATUSES } from './constants'
import { omis } from '../../../lib/urls'

export const transformOrderToListItem = ({
  id,
  status,
  sector,
  contact,
  company,
  uk_region,
  reference,
  created_on,
  modified_on,
  delivery_date,
  primary_market,
} = {}) => {
  const orderState = find(STATUSES, { value: status })

  const metadata = [
    {
      label: 'Company',
      value: company?.name,
    },
    {
      label: 'Created',
      value: created_on ? formatWithTime(created_on) : null,
    },
    {
      label: 'Contact',
      value: contact?.name,
    },
    {
      label: 'UK region',
      value: uk_region?.name,
    },
    {
      label: 'Sector',
      value: sector?.name,
    },
    {
      label: 'Delivery date',
      value: delivery_date ? format(delivery_date) : null,
    },
  ].filter((item) => item.value)

  const badges = [
    { text: orderState?.label },
    { text: primary_market?.name },
  ].filter((item) => item.text)

  const retVal = {
    id,
    badges,
    metadata,
    headingText: reference,
    headingUrl: omis.workOrder(id),
    subheading: modified_on
      ? `Updated on ${formatWithTime(modified_on)}`
      : null,
  }

  return retVal
}

export const transformResponseToCollection = ({
  count,
  results = [],
  summary,
}) => ({
  count,
  summary,
  results: results.map(transformOrderToListItem),
})

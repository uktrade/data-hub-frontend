import { get } from 'lodash'

import urls from '../../../lib/urls'

import { format, formatWithTime } from '../../../client/utils/date-utils'

const transformEventToListItem = ({
  id,
  name,
  event_type,
  address_country,
  modified_on,
  start_date,
  end_date,
  organiser,
  lead_team,
  uk_region,
  disabled_on,
} = {}) => {
  if (!id) {
    return
  }

  const metadata = [
    {
      label: 'Type',
      value: get(event_type, 'name'),
    },
  ]
  if (start_date) {
    metadata.push({
      label: 'Begins',
      value: format(start_date),
    })
  }
  if (start_date || end_date) {
    metadata.push({
      label: 'Ends',
      value: format(end_date || start_date),
    })
  }
  if (lead_team) {
    metadata.push({
      label: 'Lead team',
      value: get(lead_team, 'name'),
    })
  }
  if (organiser) {
    metadata.push({
      label: 'Organiser',
      value: get(organiser, 'name'),
    })
  }

  const badges = [
    { text: get(address_country, 'name') },
    { text: get(uk_region, 'name') },
  ]
  if (disabled_on) {
    badges.push({ text: 'Disabled' })
  }

  return {
    id,
    headingText: name,
    headingUrl: urls.events.details(id),
    subheading: modified_on
      ? `Updated on ${formatWithTime(modified_on)}`
      : undefined,
    badges: badges.filter((item) => item.text),
    metadata: metadata.filter((item) => item.value),
  }
}

const transformResponseToEventCollection = ({ count, results = [] }) => ({
  count,
  results: results.map(transformEventToListItem),
})

export { transformResponseToEventCollection }

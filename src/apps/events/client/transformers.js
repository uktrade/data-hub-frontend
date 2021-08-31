import { get } from 'lodash'

import urls from '../../../lib/urls'

const {
  format,
  formatMediumDateTime,
  formatMediumDate,
} = require('../../../client/utils/date')

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
      ? `Updated on ${formatMediumDateTime(modified_on)}`
      : undefined,
    badges: badges.filter((item) => item.text),
    metadata: metadata.filter((item) => item.value),
  }
}

const transformResponseToEventCollection = ({ count, results = [] }) => ({
  count,
  results: results.map(transformEventToListItem),
})

const idNameToValueLabel = ({ id, name }) => ({ value: id, label: name })

const transformResponseToEventDetails = ({
  event_type,
  start_date,
  end_date,
  location_type,
  address_1,
  address_2,
  address_town,
  address_county,
  address_country,
  uk_region,
  notes,
  lead_team,
  organiser,
  teams,
  related_programmes,
  related_trade_agreements,
  service,
}) => ({
  eventType: event_type.name,
  startDate: formatMediumDate(start_date),
  endDate: formatMediumDate(end_date),
  locationType: location_type?.name,
  fullAddress:
    `${address_1 ? `${address_1}, ` : ''}` +
    `${address_2 ? `${address_2}, ` : ''}` +
    `${address_town ? `${address_town}, ` : ''}` +
    `${address_county ? `${address_county}, ` : ''}` +
    `${address_country.name ? address_country.name : ''}`,
  ukRegion: uk_region?.name,
  notes: notes,
  leadTeam: lead_team.name,
  organiser: organiser.name,
  otherTeams: teams.map(idNameToValueLabel),
  relatedProgrammes: related_programmes.map(idNameToValueLabel),
  relatedTradeAgreements: related_trade_agreements.map(idNameToValueLabel),
  service: service.name,
})

export { transformResponseToEventCollection, transformResponseToEventDetails }

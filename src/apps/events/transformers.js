/* eslint-disable camelcase */
const { get } = require('lodash')

const { getFormattedAddress } = require('../../lib/address')

function transformEventToListItem ({
  id,
  name,
  event_type,
  address_country,
  created_on,
  modified_on,
  start_date,
  end_date,
  location_type,
  address_1,
  address_2,
  address_town,
  address_county,
  address_postcode,
  notes,
  organiser,
  lead_team,
  uk_region,
}) {
  if (!id || !name) { return }

  const item = {
    id,
    type: 'event',
    name,
    meta: [
      {
        label: 'Type',
        value: get(event_type, 'name'),
      },
      {
        label: 'Updated',
        type: 'datetime',
        value: modified_on,
      },
      {
        label: 'Begins',
        type: 'date',
        value: start_date,
      },
      {
        label: 'Ends',
        type: 'date',
        value: end_date || start_date,
      },
    ],
  }

  if (organiser) {
    item.meta.push(
      {
        label: 'Organiser',
        value: get(organiser, 'name'),
      })
  }

  item.meta.push(
    {
      label: 'Country',
      type: 'badge',
      value: get(address_country, 'name'),
    })

  if (lead_team) {
    item.meta.push(
      {
        label: 'Lead team',
        value: get(lead_team, 'name'),
      })
  }

  if (get(address_country, 'id') === '80756b9a-5d95-e211-a939-e4115bead28a') { // United Kingdom
    item.meta.push(
      {
        label: 'Region',
        type: 'badge',
        value: get(uk_region, 'name'),
      })
  }

  return item
}

function transformEventResponseToViewRecord ({
  event_type,
  start_date,
  end_date,
  location_type,
  address_1,
  address_2,
  address_town,
  address_county,
  address_postcode,
  address_country,
  uk_region,
  notes,
  lead_team,
  organiser,
  teams,
  related_programmes,
  service,
}) {
  teams = teams || []
  related_programmes = related_programmes || []

  const transformedEvent = {
    'Type of event': event_type,
  }

  if (start_date === end_date) {
    transformedEvent['Event date'] = {
      type: 'date',
      name: start_date,
    }
  } else {
    transformedEvent['Event start date'] = {
      type: 'date',
      name: start_date,
    }
    transformedEvent['Event end date'] = {
      type: 'date',
      name: end_date,
    }
  }

  return Object.assign(transformedEvent, {
    'Event location type': location_type,
    'Address': getFormattedAddress({
      address_1,
      address_2,
      address_town,
      address_county,
      address_postcode,
      address_country,
    }),
    'Region': uk_region,
    'Notes': notes,
    'Lead team': lead_team,
    'Organiser': organiser,
    'Other teams': teams
      .filter(team => team.id !== lead_team.id)
      .map(item => item.name),
    'Related programmes': related_programmes
      .map(item => item.name),
    'Service': service,
  })
}

module.exports = {
  transformEventToListItem,
  transformEventResponseToViewRecord,
}

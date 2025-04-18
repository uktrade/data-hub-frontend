const { assign, get, uniq } = require('lodash')

const castCompactArray = require('../../lib/cast-compact-array')
const { transformDateObjectToDateString } = require('../transformers')

function transformEventToListItem({
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
}) {
  if (!id || !name) {
    return
  }

  const item = {
    id,
    type: 'event',
    url: `/events/${id}/details`,
    name,
    subTitle: {
      type: 'datetime',
      value: modified_on,
      label: 'Updated on',
    },
    meta: [
      {
        label: 'Type',
        value: get(event_type, 'name'),
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
    item.meta.push({
      label: 'Organiser',
      value: get(organiser, 'name'),
    })
  }

  item.meta.push({
    label: 'Country',
    type: 'badge',
    value: get(address_country, 'name'),
  })

  if (lead_team) {
    item.meta.push({
      label: 'Lead team',
      value: get(lead_team, 'name'),
    })
  }

  if (disabled_on) {
    item.meta.push({
      label: 'Disabled',
      value: 'Disabled',
      type: 'badge',
    })
  }

  if (get(address_country, 'id') === '80756b9a-5d95-e211-a939-e4115bead28a') {
    // United Kingdom
    item.meta.push({
      label: 'Region',
      type: 'badge',
      value: get(uk_region, 'name'),
    })
  }

  return item
}

function transformEventResponseToFormBody(props = {}) {
  const teams = props.teams || []

  return assign({}, props, {
    teams: teams.map((team) => get(team, 'id')),
    service: get(props.service, 'id'),
    event_shared: !!teams.length,
    organiser: get(props.organiser, 'id'),
  })
}

function transformEventFormBodyToApiRequest(props) {
  const teamsArray = castCompactArray(props.teams)
  const related_programmes = castCompactArray(props.related_programmes)
  const related_trade_agreements = castRelatedTradeAgreements()
  const teams = props.lead_team
    ? teamsArray.concat(props.lead_team)
    : teamsArray
  const organiser = props.organiser

  return assign({}, props, {
    start_date: transformDateObjectToDateString('start_date')(props),
    end_date: transformDateObjectToDateString('end_date')(props),
    teams: uniq(teams),
    organiser: organiser,
    related_programmes,
    related_trade_agreements,
  })

  function castRelatedTradeAgreements() {
    return props.has_related_trade_agreements === 'true'
      ? props.related_trade_agreements.length === 0
        ? null
        : castCompactArray(props.related_trade_agreements)
      : []
  }
}

module.exports = {
  transformEventToListItem,
  transformEventResponseToFormBody,
  transformEventFormBodyToApiRequest,
}

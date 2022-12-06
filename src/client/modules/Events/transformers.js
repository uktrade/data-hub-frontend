import { get, compact } from 'lodash'

import urls from '../../../lib/urls'

import {
  format,
  formatMediumDateTime,
  getDifferenceInDays,
  formatLongDate,
  formatStartAndEndDate,
} from '../../utils/date'

import { transformIdNameToValueLabel } from '../../transformers'

import {
  EVENT_AVENTRI_ATTENDEES_MAPPING,
  EVENT_ATTENDEES_STATUS_BEFORE_EVENT,
  EVENT_ATTENDEES_STATUS_AFTER_EVENT,
} from '../../../apps/companies/apps/activity-feed/constants'

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

const transformResponseToEventDetails = ({
  name,
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
  related_trade_agreements,
  service,
  archived_documents_url_path,
  disabled_on,
}) => ({
  name,
  eventType: event_type.name,
  startDate: formatLongDate(start_date),
  endDate: formatLongDate(end_date),
  eventDays:
    getDifferenceInDays(end_date) - getDifferenceInDays(start_date) + 1,
  locationType: location_type?.name,
  fullAddress: compact([
    address_1,
    address_2,
    address_town,
    address_county,
    address_postcode,
    address_country?.name,
  ]).join(', '),
  ukRegion: uk_region?.name,
  notes: notes,
  leadTeam: lead_team?.name,
  organiser: organiser?.name,
  otherTeams: teams?.map(transformIdNameToValueLabel),
  relatedProgrammes: related_programmes?.map(transformIdNameToValueLabel),
  relatedTradeAgreements: related_trade_agreements?.map(
    transformIdNameToValueLabel
  ),
  service: service.name,
  archivedDocumentsUrlPath: archived_documents_url_path,
  disabledOn: disabled_on,
})

const transformResponseToEventAventriDetails = ({
  id,
  object,
  type,
  registrationStatuses = [],
}) => {
  const eventDetails = {
    id,
    name: object?.name,
    type,
    eventDate: formatStartAndEndDate(object?.startTime, object?.endTime),
    upcomingEvent: getDifferenceInDays(object?.endTime) > 0,
    location: object['dit:aventri:locationname'],
    fullAddress: compact([
      object['dit:aventri:location_address1'],
      object['dit:aventri:location_address2'],
      object['dit:aventri:location_city'],
      object['dit:aventri:location_postcode'],
      object['dit:aventri:location_country'],
    ]),
  }
  const allowedStatuses = eventDetails.upcomingEvent
    ? EVENT_ATTENDEES_STATUS_BEFORE_EVENT
    : EVENT_ATTENDEES_STATUS_AFTER_EVENT
  eventDetails.registrationStatusCounts = transformAventriEventStatus({
    allowedStatuses,
    registrationStatuses,
  })
  return eventDetails
}

const transformAventriEventStatus = ({
  allowedStatuses,
  registrationStatuses,
}) => {
  const mappedStatus = registrationStatuses
    .map((regStatus) => {
      return {
        ...regStatus,
        ...EVENT_AVENTRI_ATTENDEES_MAPPING[regStatus.status],
      }
    })
    .filter(
      (status) => status.count > 0 && allowedStatuses.includes(status.status)
    )
  const groupedStatusCounts = groupAndSumCounts(mappedStatus)

  return groupedStatusCounts
}

const groupAndSumCounts = (statuses) => {
  return Object.values(
    statuses.reduce(
      (r, o) => (
        r[o.status] ? (r[o.status].count += o.count) : (r[o.status] = { ...o }),
        r
      ),
      {}
    )
  )
}

const transformAventriEventAttendeesRegistionStatusToBolean = ({
  totalAttendees,
}) => ({ status: totalAttendees >= 1 ? true : false, total: totalAttendees })

export {
  transformResponseToEventCollection,
  transformResponseToEventDetails,
  transformResponseToEventAventriDetails,
  transformAventriEventAttendeesRegistionStatusToBolean,
  transformAventriEventStatus,
}

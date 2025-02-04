import { compact } from 'lodash'

import urls from '../../../lib/urls'

import { getDifferenceInDays } from '../../utils/date'
import { formatStartAndEndDate } from '../../components/ActivityFeed/activities/date'

import { TAG_COLOURS } from '../../components/Tag'
import {
  formatDate,
  DATE_FORMAT_FULL,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../utils/date-utils'

import { transformIdNameToValueLabel } from '../../transformers'
import {
  getServiceText,
  getServiceOtherText,
} from '../../components/ActivityFeed/activities/InteractionUtils'

const transformEventToListItem = ({
  id,
  name,
  event_type,
  modified_on,
  start_date,
  end_date,
  organiser,
  lead_team,
  service,
  stova_event,
} = {}) => {
  const [, service2] = service ? service.name.split(' : ') : ''
  const tags = []
  if (event_type) {
    tags.push({
      text: event_type.name,
      colour: TAG_COLOURS.GREY,
      dataTest: 'event-kind-label',
    })
  }

  if (service) {
    tags.push({
      text: getServiceText(service.name),
      colour: TAG_COLOURS.GOV_BLUE,
      dataTest: 'event-theme-label',
    })
  }

  if (service && service2) {
    tags.push({
      text: getServiceOtherText(service2),
      colour: TAG_COLOURS.BLUE,
      dataTest: 'event-service-label',
    })
  }

  const metadata = []
  if (start_date || end_date) {
    metadata.push({
      label: 'Event date',
      value: formatStartAndEndDate(start_date, end_date),
    })
  }

  if (organiser) {
    metadata.push({
      label: 'Organiser',
      value: organiser.name,
    })
  }

  if (service) {
    metadata.push({
      label: 'Service type',
      value: service.name,
    })
  }

  if (lead_team) {
    metadata.push({
      label: 'Lead team',
      value: lead_team.name,
    })
  }

  let headingUrl = (headingUrl = urls.events.details(id))
  if (stova_event) {
    headingUrl = urls.events.stova.details(stova_event.id)
  }

  return {
    id,
    headingText: name,
    headingUrl: headingUrl,
    subheading:
      modified_on &&
      `Updated on ${formatDate(modified_on, DATE_FORMAT_MEDIUM_WITH_TIME)}`,
    tags: tags,
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
  disabled_on,
}) => ({
  name,
  eventType: event_type.name,
  startDate: formatDate(start_date, DATE_FORMAT_FULL),
  endDate: formatDate(end_date, DATE_FORMAT_FULL),
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
  eventDetails.registrationStatusCounts = registrationStatuses.filter(
    (s) => s.count > 0
  )
  return eventDetails
}

const transformAventriEventAttendeesRegistionStatusToBolean = ({
  totalAttendees,
}) => ({ status: totalAttendees >= 1 ? true : false, total: totalAttendees })

export {
  transformResponseToEventCollection,
  transformResponseToEventDetails,
  transformResponseToEventAventriDetails,
  transformAventriEventAttendeesRegistionStatusToBolean,
}

import React from 'react'
import CardUtils from './card/CardUtils'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@govuk-react/link'

import { formatStartAndEndDate } from '../../../utils/date'
import { ACTIVITY_TYPE } from '../constants'

import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityCardLabels from './card/ActivityCardLabels'

// Event index to extract unique uuid from DataHubEvent id string feed by activity-stream
// e.g. dit:DataHubEvent:b93d4274-36fe-4008-ac40-fbc197916666:Announce
const EVENT_ID_INDEX = 2
export default function DataHubEvent({ activity: event }) {
  const eventObject = event.object
  const eventName = eventObject.name
  const eventId = eventObject.id.split(':')[EVENT_ID_INDEX]
  const date = formatStartAndEndDate(eventObject.startTime, eventObject.endTime)
  const organiser = eventObject['dit:organiser']?.name || 'Not set'
  const serviceType = eventObject['dit:service']?.name || 'Not set'
  const leadTeam = eventObject['dit:leadTeam']?.name || 'Not set'
  const typeOfEvent = eventObject['dit:eventType']?.name || 'Not set'
  const serviceTypeSplit = serviceType.split(':')
  const theme = serviceTypeSplit[0]
  const service = serviceTypeSplit[1]
  return (
    <ActivityCardWrapper dataTest="data-hub-event">
      <ActivityCardSubject dataTest="data-hub-event-name">
        <ActivityCardLabels
          theme={theme}
          service={service}
          kind={typeOfEvent}
        />
        <Link as={RouterLink} to={`/events/${eventId}/details`}>
          {eventName}
        </Link>
      </ActivityCardSubject>
      <ActivityCardMetadata
        metadata={[
          {
            label: 'Event date',
            value: date,
          },
          {
            label: 'Organiser',
            value: organiser,
          },
          {
            label: 'Service type',
            value: serviceType,
          },
          {
            label: 'Lead team',
            value: leadTeam,
          },
        ]}
      />
    </ActivityCardWrapper>
  )
}

DataHubEvent.canRender = (event) => {
  return CardUtils.canRenderByTypes(event, ACTIVITY_TYPE.DataHubEvent)
}

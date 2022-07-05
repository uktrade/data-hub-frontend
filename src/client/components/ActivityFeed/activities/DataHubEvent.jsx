import React from 'react'
import { isEmpty } from 'lodash'
import CardUtils from './card/CardUtils'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@govuk-react/link'

import { formatStartAndEndDate } from '../../../utils/date'
import { ACTIVITY_TYPE } from '../constants'

import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'

// Regex to match UUID4 string from DataHubEvent id format
// e.g. dit:DataHubEvent:b93d4274-36fe-4008-ac40-fbc197918888:Announce
const UUID_REGEX =
  /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/

export default function DataHubEvent({ activity: event }) {
  const eventObject = event.object
  const eventName = eventObject.name
  const eventId = eventObject.id.split(':').filter((x) => x.match(UUID_REGEX))
  const date = formatStartAndEndDate(eventObject.startTime, eventObject.endTime)
  const organiser = eventObject['dit:organiser']?.name || 'Not set'
  const serviceType = eventObject['dit:service']?.name || 'Not set'
  const leadTeam = eventObject['dit:leadTeam']?.name || 'Not set'

  return (
    <ActivityCardWrapper dataTest="data-hub-event">
      <ActivityCardSubject dataTest="data-hub-event-name">
        {!isEmpty(eventId) ? (
          <Link as={RouterLink} to={`/events/${eventId}/details`}>
            {eventName}
          </Link>
        ) : (
          eventName
        )}
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

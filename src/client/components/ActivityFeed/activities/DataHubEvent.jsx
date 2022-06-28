import React from 'react'
import CardUtils from './card/CardUtils'

import { formatStartAndEndDate } from '../../../utils/date'
import { ACTIVITY_TYPE } from '../constants'

import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'

const UUID_REGEX =
  /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/

export default function DataHubEvent({ activity: event }) {
  const eventObject = event.object
  const eventName = eventObject.name
  const date = formatStartAndEndDate(eventObject.startTime, eventObject.endTime)
  const organiser = eventObject['dit:organiser']?.name || 'Not set'
  const serviceType = eventObject['dit:service']?.name || 'Not set'
  const leadTeam = eventObject['dit:leadTeam']?.name || 'Not set'

  return (
    <ActivityCardWrapper dataTest="data-hub-event">
      <ActivityCardSubject dataTest="data-hub-event-name">
        {eventName}
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

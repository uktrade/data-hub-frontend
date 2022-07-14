import React from 'react'
import CardUtils from './card/CardUtils'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@govuk-react/link'

import { formatStartAndEndDate } from '../../../utils/date'
import { ACTIVITY_TYPE } from '../constants'

import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'

// Event index to extract id from Aventri Event string feed by activity-stream
// e.g. dit:aventri:Event:1113:Create
const EVENT_ID_INDEX = 3
export default function AventriEvent({ activity: event }) {
  const eventObject = event.object
  const name = eventObject.name
  const aventriEventId = eventObject.id.split(':')[EVENT_ID_INDEX]
  const date = formatStartAndEndDate(eventObject.startTime, eventObject.endTime)

  return (
    <ActivityCardWrapper dataTest="aventri-event">
      <ActivityCardSubject dataTest="aventri-event-name">
        <Link as={RouterLink} to={`/events/aventri/${aventriEventId}/details`}>
          {name}
        </Link>
      </ActivityCardSubject>
      <ActivityCardMetadata
        metadata={[
          {
            label: 'Event date',
            value: date,
          },
        ]}
      />
    </ActivityCardWrapper>
  )
}

AventriEvent.canRender = (event) => {
  return CardUtils.canRenderByTypes(event, ACTIVITY_TYPE.AventriEvent)
}

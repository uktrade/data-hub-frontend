import React from 'react'
import CardUtils from './card/CardUtils'

import { formatStartAndEndDate } from '../../../utils/date'
import { ACTIVITY_TYPE } from '../constants'

import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'

export default function AventriEvent({ activity: event }) {
  const eventObject = event.object
  const name = eventObject.name
  const date = formatStartAndEndDate(eventObject.startTime, eventObject.endTime)

  return (
    <ActivityCardWrapper dataTest="aventri-event">
      <ActivityCardSubject dataTest="aventri-event-name">
        {name}
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
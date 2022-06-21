import React from 'react'
import PropTypes from 'prop-types'
import CardUtils from './card/CardUtils'

import { formatStartAndEndDate } from '../../../utils/date'
import { ACTIVITY_TYPE } from '../constants'

import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'

export default function DataHubEvents({ activity: event }) {
  const eventObject = event.object
  const name = eventObject.name
  const date = formatStartAndEndDate(eventObject.startTime, eventObject.endTime)

  return (
    <ActivityCardWrapper dataTest="data-hub-event">
      <ActivityCardSubject dataTest="data-hub-event-subject">
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

DataHubEvents.propTypes = {
  event: PropTypes.object.isRequired,
}

DataHubEvents.canRender = (event) => {
  return CardUtils.canRenderByTypes(event, ACTIVITY_TYPE.DataHubEvents)
}

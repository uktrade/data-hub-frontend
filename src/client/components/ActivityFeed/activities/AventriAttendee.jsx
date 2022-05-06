import React from 'react'
import PropTypes from 'prop-types'
import CardUtils from './card/CardUtils'
import { ACTIVITY_TYPE } from '../constants'
import { format } from '../../../utils/date'

import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityCardLabels from './card/ActivityCardLabels'

const transformAventriAttendee = (activity) => {
  return {
    eventName: activity.eventName,
    startDate: format(activity.startDate),
  }
}
export default function AventriAttendee({ activity }) {
  const { eventName, startDate } = transformAventriAttendee(activity)

  return (
    <ActivityCardWrapper dataTest="aventri-activity">
      <ActivityCardLabels service="events" kind="aventri service delivery" />
      <ActivityCardSubject>{eventName}</ActivityCardSubject>
      <ActivityCardMetadata
        metadata={[{ label: 'Date', value: startDate || 'Unknown' }]}
      />
    </ActivityCardWrapper>
  )
}

AventriAttendee.propTypes = {
  activity: PropTypes.object.isRequired,
}

AventriAttendee.canRender = (activity) => {
  return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.AventriAttendee)
}

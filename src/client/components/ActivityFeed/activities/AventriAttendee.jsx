import React from 'react'
import PropTypes from 'prop-types'
import CardUtils from './card/CardUtils'
import { ACTIVITY_TYPE } from '../constants'
import { formatStartAndEndDate } from '../../../utils/date'

import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityCardLabels from './card/ActivityCardLabels'

const transformAventriAttendee = (activity) => ({
  eventName: activity.eventName,
  date: formatStartAndEndDate(activity.startDate, activity.endDate),
  virtualAttendanceConfirmed:
    activity.object['dit:aventri:virtual_attendance_confirmed'],
})
export default function AventriAttendee({ activity }) {
  const { eventName, date, virtualAttendanceConfirmed } =
    transformAventriAttendee(activity)

  return (
    <ActivityCardWrapper dataTest="aventri-activity">
      <ActivityCardLabels service="event" kind="aventri service delivery" />
      <ActivityCardSubject>
        {`${eventName}: ${virtualAttendanceConfirmed == 'Yes' && 'Attended'}`}
      </ActivityCardSubject>
      <ActivityCardMetadata
        metadata={[{ label: 'Event date', value: date || 'Unknown' }]}
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

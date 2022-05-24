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
  isVirtualAttendanceConfirmed:
    activity.object['dit:aventri:virtual_event_attendance'],
})

const VIRTUAL_EVENT_ATTENDANCE_STATUS = 'Attended'
export default function AventriAttendee({ activity }) {
  const { eventName, date, isVirtualAttendanceConfirmed } =
    transformAventriAttendee(activity)

  return (
    <ActivityCardWrapper dataTest="aventri-activity">
      <ActivityCardLabels service="event" kind="aventri service delivery" />
      <ActivityCardSubject>
        {/* TODO: This initial/plain presentation of event name with attendance status ATM, 
                    styling and link will be apply when aventri details page is available */}
        {`${eventName}${
          isVirtualAttendanceConfirmed == 'Yes'
            ? `: ${VIRTUAL_EVENT_ATTENDANCE_STATUS}`
            : ''
        }`}
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

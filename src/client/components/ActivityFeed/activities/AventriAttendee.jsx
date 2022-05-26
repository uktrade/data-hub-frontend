import React from 'react'
import PropTypes from 'prop-types'
import CardUtils from './card/CardUtils'
import { ACTIVITY_TYPE } from '../constants'
import { formatStartAndEndDate } from '../../../utils/date'
import { GREY_1 } from 'govuk-colours'
import styled from 'styled-components'

import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityCardLabels from './card/ActivityCardLabels'

const VIRTUAL_EVENT_ATTENDANCE_STATUS = 'Attended'

const transformAventriAttendee = (activity) => ({
  eventName: activity.eventName,
  date: formatStartAndEndDate(activity.startDate, activity.endDate),
  isVirtualAttendanceConfirmed:
    activity.object['dit:aventri:virtual_event_attendance'] == 'Yes',
})

const StyledSpan = styled('span')`
  & > span {
    color: ${GREY_1};
  }
`

export default function AventriAttendee({ activity }) {
  const { eventName, date, isVirtualAttendanceConfirmed } =
    transformAventriAttendee(activity)

  return (
    <ActivityCardWrapper dataTest="aventri-activity">
      <ActivityCardLabels service="event" kind="aventri service delivery" />
      <ActivityCardSubject>
        {eventName}
        {isVirtualAttendanceConfirmed && (
          <StyledSpan>
            : <span>{VIRTUAL_EVENT_ATTENDANCE_STATUS}</span>
          </StyledSpan>
        )}
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

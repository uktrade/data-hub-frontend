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

const transformAventriAttendee = (attendee) => ({
  eventName: attendee.eventName,
  attendeeName: `${attendee.object['dit:aventri:firstname']} ${attendee.object['dit:aventri:lastname']}`,
  date: formatStartAndEndDate(attendee.startDate, attendee.endDate),
  isVirtualAttendanceConfirmed:
    attendee.object['dit:aventri:virtual_event_attendance'] === 'Yes',
})

const StyledSpan = styled('span')`
  & > span {
    color: ${GREY_1};
  }
`

export default function AventriAttendee({ activity: attendee }) {
  const { eventName, attendeeName, date, isVirtualAttendanceConfirmed } =
    transformAventriAttendee(attendee)

  return eventName ? (
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
  ) : (
    <ActivityCardWrapper dataTest="aventri-attendee">
      <ActivityCardSubject dataTest="aventri-attendee-name">
        {attendeeName}
      </ActivityCardSubject>
    </ActivityCardWrapper>
  )
}

AventriAttendee.propTypes = {
  attendee: PropTypes.object,
}

AventriAttendee.canRender = (attendee) => {
  return CardUtils.canRenderByTypes(attendee, ACTIVITY_TYPE.AventriAttendee)
}

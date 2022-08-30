import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import CardUtils from './card/CardUtils'
import { ACTIVITY_TYPE } from '../constants'
import { GREY_1 } from 'govuk-colours'
import styled from 'styled-components'

import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityCardLabels from './card/ActivityCardLabels'
import { formatStartAndEndDate } from '../../../utils/date'

export const AVENTRI_ATTENDEE_REG_STATUSES = {
  Attended: 'Attended',
  Cancelled: 'Cancelled',
  Confirmed: 'Registered',
  Incomplete: 'Incomplete',
}

export const transformAventriAttendee = (attendee) => ({
  attendeeName: `${attendee.object['dit:firstName']} ${attendee.object['dit:lastName']}`,
  date: formatStartAndEndDate(attendee.startDate, attendee.endDate),
  eventName: attendee.eventName,
  registrationStatus:
    AVENTRI_ATTENDEE_REG_STATUSES[attendee.object['dit:registrationStatus']],
  contactUrl: attendee.datahubContactUrl,
})

const StyledSpan = styled('span')`
  & > span {
    color: ${GREY_1};
  }
`

export default function AventriAttendee({ activity: attendee }) {
  const { attendeeName, eventName, date, registrationStatus, contactUrl } =
    transformAventriAttendee(attendee)

  return eventName ? (
    <ActivityCardWrapper dataTest="aventri-activity">
      <ActivityCardLabels
        service="event"
        kind={
          registrationStatus === 'Attended'
            ? 'aventri service delivery'
            : 'interaction'
        }
      />
      <ActivityCardSubject>
        {eventName}
        {registrationStatus && (
          <StyledSpan>
            : <span>{registrationStatus}</span>
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
        {contactUrl ? (
          <Link href={contactUrl}>{attendeeName}</Link>
        ) : (
          attendeeName
        )}
      </ActivityCardSubject>
    </ActivityCardWrapper>
  )
}

AventriAttendee.propTypes = {
  activity: PropTypes.object.isRequired,
}

AventriAttendee.canRender = (attendee) => {
  return CardUtils.canRenderByTypes(attendee, ACTIVITY_TYPE.AventriAttendee)
}

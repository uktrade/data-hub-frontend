import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import styled from 'styled-components'

import CardUtils from './card/CardUtils'
import { ACTIVITY_TYPE } from '../constants'
import { GREY_1 } from '../../../../client/utils/colours'

import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityCardLabels from './card/ActivityCardLabels'
import { formatStartAndEndDate } from './date'

export const AVENTRI_ATTENDEE_REG_STATUSES = {
  Attended: 'Attended',
  Cancelled: 'Cancelled',
  Confirmed: 'Registered',
  Incomplete: 'Incomplete',
}

export const extractAventriId = (attendee) => {
  // Event index to extract id from Aventri Event string feed by activity-stream
  // e.g. dit:aventri:Event:1113:Create
  const EVENT_ID_INDEX = 3
  const aventriEventId =
    attendee.object.attributedTo.id.split(':')[EVENT_ID_INDEX]
  return aventriEventId
}
export const transformAventriAttendee = (attendee) => ({
  attendeeName: `${attendee.object['dit:firstName']} ${attendee.object['dit:lastName']}`,
  date: formatStartAndEndDate(attendee.startDate, attendee.endDate),
  eventName: attendee.eventName,
  eventId: extractAventriId(attendee),
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
  const {
    attendeeName,
    eventName,
    eventId,
    date,
    registrationStatus,
    contactUrl,
  } = transformAventriAttendee(attendee)

  return eventName ? (
    <ActivityCardWrapper dataTest="aventri-activity">
      <ActivityCardSubject>
        <Link href={`/events/aventri/${eventId}/details`}>{eventName}</Link>

        {registrationStatus && (
          <StyledSpan>
            : <span>{registrationStatus}</span>
          </StyledSpan>
        )}
      </ActivityCardSubject>
      <ActivityCardLabels
        service="event"
        kind={
          registrationStatus === 'Attended' ? 'aventri event' : 'interaction'
        }
      />
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

import React from 'react'
import CardUtils from './card/CardUtils'
import Link from '@govuk-react/link'

import { formatStartAndEndDate } from '../../../utils/date'
import { ACTIVITY_TYPE } from '../constants'

import styled from 'styled-components'

import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityCardLabels from './card/ActivityCardLabels'

const StyledContactsList = styled('ul')`
  padding-left: 15px;
`

const RegisteredLabel = styled('label')`
  color: grey;
`

// Event index to extract id from Aventri Event string feed by activity-stream
// e.g. dit:aventri:Event:1113:Create
const EVENT_ID_INDEX = 3
export default function AventriEvent({ activity: event }) {
  const eventObject = event.object
  const name = eventObject.name
  const aventriEventId = eventObject.id.split(':')[EVENT_ID_INDEX]
  const date = formatStartAndEndDate(eventObject.startTime, eventObject.endTime)
  const contacts = CardUtils.getContactsGroupedByRegistrationStatus(event)
  const status = CardUtils.getStatusByLatest(contacts)
  const sortOrder = ['Attended', 'Registered', 'Cancelled', 'WaitingList']

  const formattedContacts = Object.entries(contacts)
    .sort(function (a, b) {
      return sortOrder.indexOf(a[0]) - sortOrder.indexOf(b[0])
    })
    .filter(([, value]) => Array.isArray(value))
    .map(([key, value]) => ({
      label: key,
      value: (
        <StyledContactsList>
          {value.map((contact, index) => (
            <li key={`contact-link-${index}`}>
              <Link data-test={`contact-link-${index}`} href={contact.url}>
                {contact.name}
              </Link>
            </li>
          ))}
        </StyledContactsList>
      ),
    }))

  return (
    <ActivityCardWrapper dataTest="aventri-event">
      <ActivityCardLabels service="Event" kind="Aventri Event" />
      <ActivityCardSubject dataTest="aventri-event-name">
        <Link href={`/events/aventri/${aventriEventId}/details`}>{name}</Link>
        <RegisteredLabel> {status}</RegisteredLabel>
      </ActivityCardSubject>
      <ActivityCardMetadata
        metadata={[
          {
            label: 'Event date',
            value: date,
          },
          ...formattedContacts,
        ]}
      />
    </ActivityCardWrapper>
  )
}

AventriEvent.canRender = (event) => {
  return CardUtils.canRenderByTypes(event, ACTIVITY_TYPE.AventriEvent)
}

import React from 'react'
import CardUtils from './card/CardUtils'
import Link from '@govuk-react/link'

import { formatStartAndEndDate } from '../../../utils/date'
import { ACTIVITY_TYPE } from '../constants'

import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityCardLabels from './card/ActivityCardLabels'

// Event index to extract id from Aventri Event string feed by activity-stream
// e.g. dit:aventri:Event:1113:Create
const EVENT_ID_INDEX = 3
export default function AventriEvent({ activity: event }) {
  const eventObject = event.object
  const name = eventObject.name
  const aventriEventId = eventObject.id.split(':')[EVENT_ID_INDEX]
  const date = formatStartAndEndDate(eventObject.startTime, eventObject.endTime)
  const contacts = CardUtils.getContactsGroupedByRegistrationStatus(event)

  //TODO check whether this can be moved into redux state / transformers
  const formattedContacts = Object.entries(contacts)
    .filter(([, value]) => Array.isArray(value))
    .map(([key, value]) => ({
      label: key,
      value: (
        <ul>
          {value.map((contact, index) => (
            <li key={`contact-link-${index}`}>
              <Link data-test={`contact-link-${index}`} href={contact.url}>
                {contact.name}
              </Link>
            </li>
          ))}
        </ul>
      ),
    }))

  return (
    <ActivityCardWrapper dataTest="aventri-event">
      <ActivityCardLabels service="Event" kind="Aventri Event" />
      <ActivityCardSubject dataTest="aventri-event-name">
        <Link href={`/events/aventri/${aventriEventId}/details`}>{name}</Link>
      </ActivityCardSubject>
      <ActivityCardMetadata
        metadata={[
          {
            label: 'Event date',
            value: date,
          },
          {
            label: 'Aventri ID',
            value: aventriEventId,
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

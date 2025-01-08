import React from 'react'
import Link from '@govuk-react/link'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { formatStartAndEndDate } from './date'
import { ACTIVITY_TYPE } from '../constants'

import CardUtils from './card/CardUtils'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityOverviewSummary from './card/item-renderers/ActivityOverviewSummary'
import OverviewActivityCardWrapper from './card/OverviewActivityCardWrapper'

const StyledContactsList = styled('ul')`
  padding-left: 15px;
`

const RegisteredLabel = styled('label')`
  color: grey;
`

// Event index to extract id from Aventri Event string feed by activity-stream
// e.g. dit:aventri:Event:1113:Create
const EVENT_ID_INDEX = 3
export default class AventriEvent extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.AventriEvent)
  }

  render() {
    const { activity, isOverview } = this.props

    const eventObject = activity.object
    const name = eventObject.name
    const aventriEventId = eventObject.id.split(':')[EVENT_ID_INDEX]
    const date = formatStartAndEndDate(
      eventObject.startTime,
      eventObject.endTime
    )
    const contacts = CardUtils.getContactsGroupedByRegistrationStatus(activity)
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
    const unFormattedContacts = Object.entries(contacts)
      .sort(function (a, b) {
        return sortOrder.indexOf(a[0]) - sortOrder.indexOf(b[0])
      })
      .filter(([, value]) => Array.isArray(value))
      .map(([, value]) => [
        <>
          {value.map((contact) => (
            <>{contact.name}</>
          ))}
        </>,
      ])
    const href = `/events/aventri/${aventriEventId}/details`
    const subject = <Link href={href}>{name}</Link>
    return isOverview ? (
      <OverviewActivityCardWrapper dataTest="aventri-event-summary">
        <ActivityOverviewSummary
          activity={activity}
          date={date}
          kind="Aventri Event"
          url={href}
          subject={subject}
          summary={[
            status,
            status || unFormattedContacts?.length > 0 ? ' by ' : '',
            unFormattedContacts,
          ]}
        ></ActivityOverviewSummary>
      </OverviewActivityCardWrapper>
    ) : (
      <ActivityCardWrapper dataTest="aventri-event">
        <ActivityCardSubject dataTest="aventri-event-name">
          {subject}
          <RegisteredLabel>: {status}</RegisteredLabel>
        </ActivityCardSubject>
        <ActivityCardLabels service="Event" kind="Aventri Event" />
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
}

import React from 'react'
import { connect } from 'react-redux'
import { GridCol, GridRow } from 'govuk-react'
import styled from 'styled-components'
import { isEmpty } from 'lodash'

import urls from '../../../../lib/urls'
import { TASK_GET_STOVA_EVENT_DETAILS, ID, state2props } from './state'
import { EVENTS__STOVA_DETAILS_LOADED } from '../../../actions'
import Task from '../../../components/Task'
import { DefaultLayout, NewWindowLink, SummaryTable } from '../../../components'
import { VerticalTabNav } from '../../../components/TabNav'
import AventriEventSyncWarning from '../../../components/ActivityFeed/activities/AventriEventSyncWarning'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

const EventDetails = ({ name, ...props }) => {
  const aventriEventLink = `https://eu-admin.eventscloud.com/loggedin/eVent/index.php?eventid=${props.stovaEventId}`
  return (
    <>
      <AventriEventSyncWarning stovaEventId={props.stovaEventId} />
      <GridRow data-test="eventAventriDetails">
        <GridCol setWidth="one-quarter"></GridCol>
        <GridCol setWidth="three-quarters">
          <StyledSummaryTable>
            <SummaryTable.Row heading="Event date" children={props.eventDate} />
            <SummaryTable.Row
              heading="Event location type"
              children={isEmpty(props.location) ? 'Not set' : props.location}
            />
            <SummaryTable.Row
              heading="Address"
              children={
                isEmpty(props.fullAddress) ? 'Not set' : props.fullAddress
              }
            />
            <SummaryTable.Row
              heading="Aventri reference number"
              children={
                <>
                  <span>
                    {props.stovaEventId}&nbsp;
                    <NewWindowLink href={aventriEventLink}>
                      View in Aventri
                    </NewWindowLink>
                  </span>
                </>
              }
            />
          </StyledSummaryTable>
        </GridCol>
      </GridRow>
    </>
  )
}

const StovaEventDetails = ({ name, ...props }) => {
  const breadcrumbs = [
    {
      link: urls.dashboard.index(),
      text: 'Home',
    },
    {
      link: urls.events.index(),
      text: 'Events',
    },
    {
      text: name,
    },
  ]

  return (
    <DefaultLayout
      heading={name}
      pageTitle="Events"
      breadcrumbs={breadcrumbs}
      useReactRouter={true}
    >
      <Task.Status
        name={TASK_GET_STOVA_EVENT_DETAILS}
        id={ID}
        progressMessage="loading stova event details"
        startOnRender={{
          payload: props.stovaEventId,
          onSuccessDispatch: EVENTS__STOVA_DETAILS_LOADED,
        }}
      >
        {() => {
          return (
            <VerticalTabNav
              routed={true}
              id="event-details-tab-nav"
              label="Event tab navigation"
              selectedIndex="attendees"
              tabs={{
                [`/events/stova/${props.stovaEventId}/details`]: {
                  label: 'Details',
                  content: <EventDetails {...props} />,
                },
              }}
            />
          )
        }}
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(StovaEventDetails)

import React from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import styled from 'styled-components'

import urls from '../../../../lib/urls'
import { TASK_GET_EVENT_DETAILS, ID, state2props } from './state'
import { EVENTS__DETAILS_LOADED } from '../../../actions'
import Task from '../../../components/Task'

import {
  LocalHeader,
  LocalNav,
  LocalNavLink,
  Main,
  SummaryTable,
  FormActions,
  NewWindowLink,
} from '../../../components'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

const EventDetails = ({
  eventId,
  name,
  eventType,
  startDate,
  endDate,
  eventDays,
  locationType,
  fullAddress,
  ukRegion,
  notes,
  leadTeam,
  organiser,
  otherTeams,
  relatedProgrammes,
  relatedTradeAgreements,
  service,
  archivedDocumentsUrlPath,
  disabledOn,
  flashMessages,
}) => {
  const breadcrumbs = [
    {
      link: urls.dashboard(),
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
    <Task.Status
      name={TASK_GET_EVENT_DETAILS}
      id={ID}
      progressMessage="loading event details"
      startOnRender={{
        payload: eventId,
        onSuccessDispatch: EVENTS__DETAILS_LOADED,
      }}
    >
      {() =>
        name && (
          <>
            <LocalHeader
              breadcrumbs={breadcrumbs}
              heading={name}
              flashMessages={flashMessages}
            />
            <Main>
              <GridRow data-test="eventDetails">
                <GridCol setWidth="one-quarter">
                  <LocalNav data-test="event-details-nav">
                    <LocalNavLink
                      data-test="event-details-nav-link"
                      href={urls.events.details(eventId)}
                    >
                      Details
                    </LocalNavLink>
                    <LocalNavLink
                      data-test="event-details-nav-link"
                      href={urls.events.attendees(eventId)}
                    >
                      Attendees
                    </LocalNavLink>
                  </LocalNav>
                </GridCol>
                <GridCol setWidth="three-quarters">
                  <StyledSummaryTable>
                    <SummaryTable.Row
                      heading="Type of event"
                      children={eventType}
                    />
                    <SummaryTable.Row
                      heading={
                        eventDays == 1 ? 'Event date' : 'Event start date'
                      }
                      children={startDate}
                    />
                    {eventDays > 1 ? (
                      <SummaryTable.Row
                        heading="Event end date"
                        children={endDate}
                      />
                    ) : null}
                    <SummaryTable.Row heading="Event location type">
                      {isEmpty(locationType) ? 'Not set' : locationType}
                    </SummaryTable.Row>
                    <SummaryTable.Row heading="Address">
                      {fullAddress}
                    </SummaryTable.Row>
                    <SummaryTable.Row heading="Region" hideWhenEmpty={false}>
                      {isEmpty(ukRegion) ? 'Not set' : ukRegion}
                    </SummaryTable.Row>
                    <SummaryTable.Row heading="Notes" hideWhenEmpty={false}>
                      {isEmpty(notes) ? 'Not set' : notes}
                    </SummaryTable.Row>
                    <SummaryTable.Row heading="Lead team">
                      {isEmpty(leadTeam) ? 'Not set' : leadTeam}
                    </SummaryTable.Row>
                    <SummaryTable.Row heading="Organiser">
                      {isEmpty(organiser) ? 'Not set' : organiser}
                    </SummaryTable.Row>
                    <SummaryTable.ListRow
                      heading="Other teams"
                      value={otherTeams}
                      emptyValue="Not set"
                      hideWhenEmpty={false}
                    />
                    <SummaryTable.ListRow
                      heading="Related programmes"
                      value={relatedProgrammes}
                      emptyValue="Not set"
                      hideWhenEmpty={false}
                    />
                    <SummaryTable.ListRow
                      heading="Related Trade Agreements"
                      value={relatedTradeAgreements}
                      emptyValue="Not set"
                      hideWhenEmpty={false}
                    />
                    <SummaryTable.Row heading="Service" children={service} />
                    {!!archivedDocumentsUrlPath && (
                      <SummaryTable.Row heading="Documents">
                        <NewWindowLink href={archivedDocumentsUrlPath}>
                          View files and documents
                        </NewWindowLink>
                      </SummaryTable.Row>
                    )}
                  </StyledSummaryTable>
                  {!disabledOn && (
                    <FormActions>
                      <Button as={Link} href={urls.events.edit(eventId)}>
                        Edit event
                      </Button>
                    </FormActions>
                  )}
                </GridCol>
              </GridRow>
            </Main>
          </>
        )
      }
    </Task.Status>
  )
}

export default connect(state2props)(EventDetails)

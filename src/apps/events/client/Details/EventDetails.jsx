import React from 'react'
import { connect } from 'react-redux'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import styled from 'styled-components'
import urls from '../../../../lib/urls'
import Task from '../../../../client/components/Task'
import { TASK_GET_EVENT_DETAILS, ID, state2props } from './state'
import { EVENTS__DETAILS_LOADED } from '../../../../client/actions'
import LocalHeader from '../../../../client/components/LocalHeader/LocalHeader.jsx'
import { Main } from '../../../../client/components'

import {
  SummaryTable,
  FormActions,
  NewWindowLink,
} from '../../../../client/components'
import { LocalNav, LocalNavLink } from '../../../../client/components'

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
            <LocalHeader breadcrumbs={breadcrumbs} heading={name} />
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

                    <SummaryTable.Row
                      heading="Event location type"
                      children={locationType}
                      hideWhenEmpty={false}
                    />
                    <SummaryTable.Row
                      heading="Address"
                      children={fullAddress}
                    />
                    <SummaryTable.Row
                      heading="Region"
                      children={ukRegion}
                      hideWhenEmpty={false}
                    />
                    <SummaryTable.Row
                      heading="Notes"
                      children={notes}
                      hideWhenEmpty={false}
                    />
                    <SummaryTable.Row heading="Lead team" children={leadTeam} />
                    <SummaryTable.Row
                      heading="Organiser"
                      children={organiser}
                    />
                    <SummaryTable.ListRow
                      heading="Other teams"
                      value={otherTeams}
                      emptyValue=""
                      hideWhenEmpty={false}
                    />
                    <SummaryTable.ListRow
                      heading="Related programmes"
                      value={relatedProgrammes}
                      emptyValue=""
                      hideWhenEmpty={false}
                    />
                    <SummaryTable.ListRow
                      heading="Related Trade Agreements"
                      value={relatedTradeAgreements}
                      emptyValue=""
                      hideWhenEmpty={false}
                    />
                    <SummaryTable.Row heading="Service" children={service} />
                    {archivedDocumentsUrlPath && (
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

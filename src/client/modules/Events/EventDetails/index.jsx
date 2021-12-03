import React from 'react'
import { connect } from 'react-redux'
import { useParams, Link } from 'react-router-dom'

import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import Button from '@govuk-react/button'
import styled from 'styled-components'

import urls from '../../../../lib/urls'
import { TASK_GET_EVENT_DETAILS, ID, state2props } from './state'
import { EVENTS__DETAILS_LOADED } from '../../../actions'
import Task from '../../../components/Task'
// TODO: RR-231 Remove
import { getMessages } from '../../../utils/flash-messages'
import {
  LocalNav,
  LocalNavLink,
  SummaryTable,
  FormActions,
  NewWindowLink,
  DefaultLayout,
} from '../../../components'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

const EventDetails = ({
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
  const { id } = useParams()

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
        payload: id,
        onSuccessDispatch: EVENTS__DETAILS_LOADED,
      }}
    >
      {() => {
        // TODO: Remove
        const messages = getMessages()
        return (
          name && (
            <DefaultLayout
              heading="Events"
              pageTitle="Events"
              flashMessages={messages}
              breadcrumbs={breadcrumbs}
            >
              <GridRow data-test="eventDetails">
                <GridCol setWidth="one-quarter">
                  <LocalNav data-test="event-details-nav">
                    <LocalNavLink
                      data-test="event-details-nav-link"
                      href={urls.events.details(id)}
                    >
                      Details
                    </LocalNavLink>
                    <LocalNavLink
                      data-test="event-details-nav-link"
                      href={urls.events.attendees(id)}
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
                      {/* <Button as={Link} href={urls.events.edit(id)}>
                      Edit event
                    </Button> */}
                      <Button as={Link} to={urls.events.edit(id)}>
                        Edit event
                      </Button>
                    </FormActions>
                  )}
                </GridCol>
              </GridRow>
            </DefaultLayout>
          )
        )
      }}
    </Task.Status>
  )
}

export default connect(state2props)(EventDetails)

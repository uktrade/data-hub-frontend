import React from 'react'
import { connect } from 'react-redux'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import urls from '../../../../lib/urls'
import Task from '../../../../client/components/Task'
import { TASK_GET_EVENT_DETAILS, ID, state2props } from './state'
import { EVENTS__DETAILS_LOADED } from '../../../../client/actions'

import { SummaryTable, FormActions } from '../../../../client/components'
import { Container } from '../../../../client/components'

const EventDetails = ({
  eventId,
  eventType,
  startDate,
  endDate,
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
}) => (
  <Container>
    <Task.Status
      name={TASK_GET_EVENT_DETAILS}
      id={ID}
      progressMessage="loading event details"
      startOnRender={{
        payload: eventId,
        onSuccessDispatch: EVENTS__DETAILS_LOADED,
      }}
    >
      {() => {
        return (
          <>
            <GridRow data-test="eventDetails">
              <GridCol setWidth="one-quarter"></GridCol>
              <GridCol setWidth="three-quarter">
                <SummaryTable>
                  <SummaryTable.Row
                    heading="Type of event"
                    children={eventType}
                  />
                  <SummaryTable.Row
                    heading="Event start date"
                    children={startDate}
                  />
                  <SummaryTable.Row
                    heading="Event end date"
                    children={endDate}
                  />
                  <SummaryTable.Row
                    heading="Event location type"
                    children={locationType}
                    hideWhenEmpty={false}
                  />
                  <SummaryTable.Row heading="Address" children={fullAddress} />
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
                  <SummaryTable.Row heading="Organiser" children={organiser} />
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
                </SummaryTable>
                <FormActions>
                  <Button as={Link} href={urls.events.edit(eventId)}>
                    Edit event
                  </Button>
                </FormActions>
              </GridCol>
            </GridRow>
          </>
        )
      }}
    </Task.Status>
  </Container>
)

export default connect(state2props)(EventDetails)

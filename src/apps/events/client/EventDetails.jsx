import React from 'react'
import { connect } from 'react-redux'
import Task from '../../../client/components/Task'
import { TASK_GET_EVENT_DETAILS, ID, state2props } from './state'
import { EVENTS__DETAILS_LOADED } from '../../../client/actions'

import { SummaryTable } from '../../../client/components'

const EventDetails = ({ eventId, eventDetails }) => (
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
      const {
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
      } = eventDetails
      return (
        eventDetails && (
          <>
            <SummaryTable>
              <SummaryTable.TextRow heading="Type of event" value={eventType} />
              <SummaryTable.TextRow
                heading="Event start date"
                value={startDate}
              />
              <SummaryTable.TextRow heading="Event end date" value={endDate} />
              <SummaryTable.TextRow
                heading="Event location type"
                value={locationType}
              />
              <SummaryTable.TextRow heading="Address" value={fullAddress} />
              <SummaryTable.TextRow heading="Region" value={ukRegion} />
              <SummaryTable.TextRow heading="Notes" value={notes} />
              <SummaryTable.TextRow heading="Lead team" value={leadTeam} />
              <SummaryTable.TextRow heading="Organiser" value={organiser} />
              <SummaryTable.ListRow heading="Other teams" value={otherTeams} />
              <SummaryTable.ListRow
                heading="Related programmes"
                value={relatedProgrammes}
              />
              <SummaryTable.ListRow
                heading="Related Trade Agreements"
                value={relatedTradeAgreements}
              />
              <SummaryTable.TextRow heading="Service" value={service} />
            </SummaryTable>
          </>
        )
      )
    }}
  </Task.Status>
)

export default connect(state2props)(EventDetails)

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
        // otherTeams,
        // realatedProgrammes,
        // realatedTradeAgreements,
        service,
      } = eventDetails
      return (
        eventDetails && (
          <>
            <SummaryTable>
              <SummaryTable.Row heading="Type of event">
                {eventType}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Event start date">
                {startDate}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Event end date">
                {endDate}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Event location type">
                {locationType}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Address">
                {fullAddress}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Region">{ukRegion}</SummaryTable.Row>
              <SummaryTable.Row heading="Notes">{notes}</SummaryTable.Row>
              <SummaryTable.Row heading="Lead team">
                {leadTeam}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Organiser">
                {organiser}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Other teams">
                {/* {!!otherTeams && otherTeams[0].label} TO-DO's */}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Related programmes">
                {/* {!!realatedProgrammes && realatedProgrammes[0].label} TO-DO's */}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Related Trade Agreements">
                {/* {!!realatedTradeAgreements && realatedTradeAgreements[0].label} TO-DO's */}
              </SummaryTable.Row>
              <SummaryTable.Row heading="Service">{service}</SummaryTable.Row>
            </SummaryTable>
          </>
        )
      )
    }}
  </Task.Status>
)

export default connect(state2props)(EventDetails)

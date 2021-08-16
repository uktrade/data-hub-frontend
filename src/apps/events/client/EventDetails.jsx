import React from 'react'
import { connect } from 'react-redux'
import Task from '../../../client/components/Task'
import { TASK_GET_EVENT_DETAILS, ID, state2props } from './state'
import { EVENTS__DETAILS_LOADED } from '../../../client/actions'

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
    {() => <>{eventDetails.eventType}</>}
  </Task.Status>
)

export default connect(state2props)(EventDetails)

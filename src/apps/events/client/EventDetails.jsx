import React from 'react'
import Task from '../../../client/components/Task'
import { TASK_GET_EVENT_DETAILS, ID } from './state'
import { EVENTS__DETAILS_LOADED } from '../../../client/actions'

const EventDetails = ({ eventId }) => {
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
      {() => <></>}
    </Task.Status>
  )
}

export default EventDetails

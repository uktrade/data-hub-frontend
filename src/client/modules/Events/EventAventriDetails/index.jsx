import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { EVENTS__AVENTRI_DETAILS_LOADED } from '../../../actions'
import { DefaultLayout } from '../../../components'
import Task from '../../../components/Task'
import { ID, state2props, TASK_GET_AVENTRI_EVENT_DETAILS } from './state'

const EventAventriDetails = () => {
  const { id } = useParams()
  console.log(id)
  return (
    <DefaultLayout heading="Events" pageTitle="Events" useReactRouter={true}>
      <p>aventri</p>

      <Task.Status
        name={TASK_GET_AVENTRI_EVENT_DETAILS}
        id={ID}
        progressMessage="loading event details"
        startOnRender={{
          payload: id,
          onSuccessDispatch: EVENTS__AVENTRI_DETAILS_LOADED,
        }}
      >
        {(aventriEvent) => {
          console.log(aventriEvent)
          return <p>details</p>
        }}
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(EventAventriDetails)

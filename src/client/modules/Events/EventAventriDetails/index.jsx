import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import urls from '../../../../lib/urls'
import { EVENTS__AVENTRI_DETAILS_LOADED } from '../../../actions'
import { DefaultLayout } from '../../../components'
import Task from '../../../components/Task'
import { ID, state2props, TASK_GET_AVENTRI_EVENT_DETAILS } from './state'

const EventAventriDetails = ({ aventriEvent }) => {
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
      text: aventriEvent?.object.name,
    },
  ]

  return (
    <DefaultLayout
      breadcrumbs={breadcrumbs}
      heading="Events"
      pageTitle="Events"
      useReactRouter={false}
    >
      <Task.Status
        name={TASK_GET_AVENTRI_EVENT_DETAILS}
        id={ID}
        progressMessage="loading event details"
        startOnRender={{
          payload: id,
          onSuccessDispatch: EVENTS__AVENTRI_DETAILS_LOADED,
        }}
      ></Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(EventAventriDetails)

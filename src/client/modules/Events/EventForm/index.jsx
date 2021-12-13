import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import urls from '../../../../lib/urls'
import { DefaultLayout } from '../../../components'
import TaskForm from '../../../components/Task/Form'
import { TASK_GET_EVENTS_FORM_AND_METADATA, TASK_SAVE_EVENT } from './state'
import { EventFormFields } from './EventFormFields'
import { transformEventFormForAPIRequest } from './transformers'

const DISPLAY_EDIT_EVENT = 'Edit event'
const DISPLAY_ADD_EVENT = 'Add event'
const DISPLAY_SAVE = 'Save and return'
const DISPLAY_CANCEL = 'Return without saving'
const DISPLAY_HOME = 'Home'
const DISPLAY_EVENTS = 'Events'

const EventForm = () => {
  const { id } = useParams()

  const breadcrumbs = [
    {
      link: urls.dashboard(),
      text: DISPLAY_HOME,
    },
    {
      link: urls.events.index(),
      text: DISPLAY_EVENTS,
    },
    {
      link: undefined,
      text: id ? DISPLAY_EDIT_EVENT : DISPLAY_ADD_EVENT,
    },
  ]

  const cancelLink = [
    {
      children: DISPLAY_CANCEL,
      to: id ? urls.events.details(id) : urls.events.index(),
    },
  ]

  const flashMessage = (submissionTaskResult) => {
    const { name } = submissionTaskResult?.data
    return `'${name}' event has been ${id ? 'updated' : 'created'}`
  }

  return (
    <DefaultLayout
      heading={id ? DISPLAY_EDIT_EVENT : DISPLAY_ADD_EVENT}
      pageTitle={id ? DISPLAY_EDIT_EVENT : DISPLAY_ADD_EVENT}
      breadcrumbs={breadcrumbs}
      useReactRouter={true}
    >
      <TaskForm
        id="event-form"
        submissionTaskName={TASK_SAVE_EVENT}
        analyticsFormName={id ? 'editEvent' : 'createEvent'}
        initialValuesTaskName={TASK_GET_EVENTS_FORM_AND_METADATA}
        initialValuesPayload={{
          eventId: id,
        }}
        redirectTo={({ data }) => urls.events.details(data.id)}
        redirectMode="soft"
        flashMessage={flashMessage}
        submitButtonLabel={id ? DISPLAY_SAVE : DISPLAY_ADD_EVENT}
        actionLinks={cancelLink}
        transformPayload={transformEventFormForAPIRequest}
      >
        {({ values }) => <EventFormFields values={values} />}
      </TaskForm>
    </DefaultLayout>
  )
}

EventForm.propTypes = {
  eventId: PropTypes.string,
}

export default EventForm

import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import urls from '../../../../lib/urls'
import { DefaultLayout, FormLayout } from '../../../components'
import Form from '../../../components/Form'
import { TASK_GET_EVENTS_FORM_AND_METADATA, TASK_SAVE_EVENT } from './state'
import { EventFormFields } from './EventFormFields'
import { transformEventFormForAPIRequest } from './transformers'
import { FORM_LAYOUT } from '../../../../common/constants'

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
      link: urls.dashboard.index(),
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
      <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
        <Form
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
          transformPayload={transformEventFormForAPIRequest}
          cancelButtonLabel={DISPLAY_CANCEL}
          cancelRedirectTo={() =>
            id ? urls.events.details(id) : urls.events.index()
          } //this originally used the react to: instead of a hard redirect, so it might break after being switched, watch out
        >
          {({ values }) => {
            if (Object.keys(values).length !== 0) {
              return <EventFormFields values={values} />
            }
          }}
        </Form>
      </FormLayout>
    </DefaultLayout>
  )
}

EventForm.propTypes = {
  eventId: PropTypes.string,
}

export default EventForm

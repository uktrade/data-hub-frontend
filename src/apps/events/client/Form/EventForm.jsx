import React from 'react'
import PropTypes from 'prop-types'

import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'

import urls from '../../../../lib/urls'
import LocalHeader from '../../../../client/components/LocalHeader/LocalHeader.jsx'
import { Main } from '../../../../client/components'
import TaskForm from '../../../../client/components/Task/Form'
import { TASK_GET_EVENTS_FORM_AND_METADATA, TASK_SAVE_EVENT } from './state'
import { EventFormFields } from './EventFormFields'
import { transformEventFormForAPIRequest } from './transformers'

const DISPLAY_EDIT_EVENT = 'Edit event'
const DISPLAY_ADD_EVENT = 'Add event'
const DISPLAY_SAVE = 'Save and return'
const DISPLAY_CANCEL = 'Return without saving'
const DISPLAY_HOME = 'Home'
const DISPLAY_EVENTS = 'Events'

const EventForm = ({ eventId }) => {
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
      text: eventId ? DISPLAY_EDIT_EVENT : DISPLAY_ADD_EVENT,
    },
  ]

  const cancelLink = [
    {
      children: DISPLAY_CANCEL,
      href: eventId ? urls.events.details(eventId) : urls.events.index(),
    },
  ]

  const flashMessage = (submissionTaskResult) => {
    const { name } = submissionTaskResult?.data
    return `'${name}' event has been ${eventId ? 'updated' : 'created'}`
  }

  return (
    <>
      <LocalHeader
        breadcrumbs={breadcrumbs}
        heading={eventId ? DISPLAY_EDIT_EVENT : DISPLAY_ADD_EVENT}
      />
      <Main>
        <GridRow data-test="eventForm">
          <GridCol setWidth="three-quarters">
            <TaskForm
              id="event-form"
              submissionTaskName={TASK_SAVE_EVENT}
              analyticsFormName={eventId ? 'editEvent' : 'createEvent'}
              initialValuesTaskName={TASK_GET_EVENTS_FORM_AND_METADATA}
              initialValuesPayload={{
                eventId,
              }}
              redirectTo={({ data }) => urls.events.details(data?.id)}
              redirectMode="hard"
              flashMessage={flashMessage}
              submitButtonLabel={eventId ? DISPLAY_SAVE : DISPLAY_ADD_EVENT}
              actionLinks={cancelLink}
              transformPayload={transformEventFormForAPIRequest}
            >
              {({ values }) => <EventFormFields values={values} />}
            </TaskForm>
          </GridCol>
        </GridRow>
      </Main>
    </>
  )
}

EventForm.propTypes = {
  eventId: PropTypes.string,
}

export default EventForm

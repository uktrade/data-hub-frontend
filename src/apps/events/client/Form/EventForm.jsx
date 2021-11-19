import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'

import urls from '../../../../lib/urls'
import LocalHeader from '../../../../client/components/LocalHeader/LocalHeader.jsx'
import { Main, NewWindowLink } from '../../../../client/components'
import TaskForm from '../../../../client/components/Task/Form'

import {
  TASK_GET_EVENTS_FORM_AND_METADATA,
  TASK_SAVE_EVENT,
  state2props,
} from './state'

import { EventFormFields } from './EventFormFields'

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

  return (
    <>
      <LocalHeader
        breadcrumbs={breadcrumbs}
        heading={eventId ? DISPLAY_EDIT_EVENT : DISPLAY_ADD_EVENT}
      />
      <Main>
        <GridRow data-test="eventForm">
          <GridCol setWidth="three-quarters">
            <article>
              <p data-test="trade-agreement-text">
                If your Event is set up to focus on a Trade Agreement or
                contributes to implementing a Trade Agreement then select that
                the event relates to a Trade Agreement and the relevant
                Agreement(s)
              </p>
              <NewWindowLink
                href={urls.external.helpCentre.tradeagreementGuidance()}
                data-test="trade-agreement-link"
              >
                See more guidance
              </NewWindowLink>
            </article>
            <TaskForm
              id="event-form"
              submissionTaskName={TASK_SAVE_EVENT}
              analyticsFormName={eventId ? 'edit_event' : 'create_event'}
              analyticsData={(values) => values}
              initialValuesTaskName={TASK_GET_EVENTS_FORM_AND_METADATA}
              initialValuesPayload={{
                eventId,
              }}
              redirectTo={({ data }) => urls.events.details(data?.id)}
              redirectMode="hard"
              flashMessage={(submissionTaskResult, formValues) => {
                const { name } = formValues
                return `'${name}' event has been ${
                  eventId ? 'updated' : 'created'
                }`
              }}
              submitButtonLabel={eventId ? DISPLAY_SAVE : DISPLAY_ADD_EVENT}
              actionLinks={[
                {
                  children: DISPLAY_CANCEL,
                  href: eventId
                    ? urls.events.details(eventId)
                    : urls.events.index(),
                },
              ]}
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

export default connect(state2props)(EventForm)

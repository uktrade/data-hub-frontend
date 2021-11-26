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
import {
  transformDateObjectToDateString,
  transformArrayOfUniqueOptions,
  transformOption,
  transformYesNoToBool,
} from '../../../../client/transformers'

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
              flashMessage={(submissionTaskResult) => {
                const { name } = submissionTaskResult?.data
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
              transformPayload={(values) => {
                const {
                  has_related_trade_agreements,
                  related_trade_agreements,
                  start_date,
                  end_date,
                  event_type,
                  location_type,
                  address_country,
                  lead_team,
                  service,
                  organiser,
                  event_shared,
                  related_programmes,
                  teams,
                  uk_region,
                } = values
                const hasRelatedTradeAgreements = transformYesNoToBool(
                  has_related_trade_agreements
                )
                const hasEventShared = transformYesNoToBool(event_shared)
                const transformedValuesOnlyPayload = {
                  has_related_trade_agreements: hasRelatedTradeAgreements,
                  related_trade_agreements: hasRelatedTradeAgreements
                    ? transformArrayOfUniqueOptions(related_trade_agreements)
                    : [],
                  event_type: transformOption(event_type),
                  start_date: transformDateObjectToDateString(start_date),
                  end_date: transformDateObjectToDateString(end_date),
                  location_type: transformOption(location_type),
                  address_country: transformOption(address_country),
                  lead_team: transformOption(lead_team),
                  service: transformOption(service),
                  organiser: transformOption(organiser),
                  event_shared: transformYesNoToBool(event_shared),
                  related_programmes:
                    transformArrayOfUniqueOptions(related_programmes),
                  teams: hasEventShared
                    ? transformArrayOfUniqueOptions(
                        teams ? teams.concat([lead_team]) : [lead_team]
                      )
                    : transformArrayOfUniqueOptions([lead_team]),
                  uk_region: transformOption(uk_region),
                }
                return Object.assign(values, transformedValuesOnlyPayload)
              }}
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

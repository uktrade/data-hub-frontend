import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'

import urls from '../../../../lib/urls'
import LocalHeader from '../../../../client/components/LocalHeader/LocalHeader.jsx'
import {
  AdviserTypeAhead,
  FieldRadios,
  FieldInput,
  FieldDate,
  FieldAddAnother,
  FieldTextarea,
  FieldTypeahead,
  Main,
  NewWindowLink,
} from '../../../../client/components'
import TaskForm from '../../../../client/components/Task/Form'

import {
  TASK_GET_EVENTS_FORM_AND_METADATA,
  TASK_SAVE_EVENT,
  state2props,
} from './state'
import { OPTIONS_YES_NO, OPTION_YES } from '../../../../client/constants'

const DISPLAY_EDIT_EVENT = 'Edit event'
const DISPLAY_ADD_EVENT = 'Add event'
const DISPLAY_SAVE = 'Save and return'
const DISPLAY_CANCEL = 'Return without saving'
const DISPLAY_HOME = 'Home'
const DISPLAY_EVENTS = 'Events'

const EventForm = ({ eventId }) => {
  const [eventName, setEventName] = useState()
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
      link: eventId ? urls.events.edit(eventId) : undefined,
      text: eventId ? eventName || DISPLAY_EDIT_EVENT : DISPLAY_ADD_EVENT,
    },
  ]

  const getDate = (value) => {
    const { day, month, year } = value
    const result = new Date(year, month, day)
    return result
  }

  const validatedStartDateBeforeOrEqualToEndDate = (
    value,
    field,
    { values }
  ) => {
    if (values && values.start_date && values.end_date) {
      const startDate = getDate(values.start_date)
      const endDate = getDate(values.end_date)
      if (startDate && endDate) {
        const result =
          startDate > endDate
            ? 'Enter a valid end date. This must be after the start date.'
            : null
        return result
      }
    }
    return null
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
                metadata: {
                  eventTypeOptions: [],
                  relatedTradeAgreements: [],
                  eventLocationTypes: [],
                  countries: [],
                  teams: [],
                  programmes: [],
                  ukRegions: [],
                },
                isComplete: false,
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
              {/* HACK isComplete hack added to fix related_programmes initialising with an udnefined value when not ready */}
              {({ values }) =>
                values?.isComplete && (
                  <>
                    {setEventName(values?.name)}
                    <FieldRadios
                      legend="Does the event relate to a trade agreement?"
                      name="has_related_trade_agreements"
                      required="Answer if the event is related to a trade agreement"
                      options={OPTIONS_YES_NO}
                      inline={true}
                    />
                    {values.has_related_trade_agreements === OPTION_YES && (
                      <FieldAddAnother
                        name="related_trade_agreements"
                        label="Related named trade agreement(s)"
                        data-test-prefix="trade-agreement-field-"
                        required="Select at least one Trade Agreement"
                        item-name="trade agreement"
                      >
                        {({ value, onChange, error }) => (
                          <FieldTypeahead
                            name="related_trade_agreements"
                            options={values?.metadata?.relatedTradeAgreements}
                            placeholder="-- Search trade agreements --"
                            required="Select at least one Trade Agreement"
                            aria-label="Select a trade agreement"
                            value={values?.metadata?.relatedTradeAgreements?.find(
                              ({ value: option_value }) =>
                                option_value === value
                            )}
                            onChange={onChange}
                            error={error}
                          />
                        )}
                      </FieldAddAnother>
                    )}
                    <FieldInput
                      label="Event name"
                      name="name"
                      type="text"
                      required="Event name may not be null."
                      data-test="group-field-name"
                    />
                    <FieldTypeahead
                      name="event_type"
                      label="Type of event"
                      options={values?.metadata?.eventTypeOptions}
                      placeholder="-- Select event type --"
                      required="Select at least one event type"
                      aria-label="Select an event type"
                    />
                    <FieldDate
                      name="start_date"
                      label="Event start date"
                      required="Enter a valid start date"
                    />
                    <FieldDate
                      name="end_date"
                      label="Event end date"
                      required="Enter a valid end date"
                      validate={validatedStartDateBeforeOrEqualToEndDate}
                    />
                    <FieldTypeahead
                      name="location_type"
                      label="Event location type (optional)"
                      options={values?.metadata?.eventLocationTypes}
                      placeholder="-- Select event --"
                      aria-label="Select an event"
                    />
                    <FieldInput
                      label="Business and street"
                      name="address_1"
                      type="text"
                      required="Business and street may not be null."
                      data-test="group-field-address-1"
                    />
                    <FieldInput
                      name="address_2"
                      type="text"
                      data-test="group-field-address-2"
                    />
                    <FieldInput
                      label="Town or city"
                      name="address_town"
                      type="text"
                      required="Town or city may not be null."
                      data-test="group-field-address_town"
                    />
                    <FieldInput
                      label="County (optional)"
                      name="address_county"
                      type="text"
                      data-test="group-field-address_county"
                    />
                    <FieldInput
                      label="Postcode"
                      name="address_postcode"
                      type="text"
                      required="Postcode may not be null."
                      data-test="group-field-address_postcode"
                    />
                    <FieldTypeahead
                      name="address_country"
                      label="Country"
                      options={values?.metadata?.countries}
                      required="Country may not be null."
                      placeholder="-- Select country --"
                      aria-label="Select a country"
                      data-test="group-field-address_country"
                    />
                    <FieldTypeahead
                      name="uk_region"
                      label="UK Region"
                      options={values?.metadata?.ukRegions}
                      required="UK region may not be null."
                      placeholder="-- Select region --"
                      aria-label="Select a region"
                      data-test="group-field-uk_region"
                    />
                    <FieldTextarea
                      type="text"
                      name="notes"
                      label="Event Notes (optional)"
                      data-test="group-field-notes"
                    />
                    <FieldTypeahead
                      name="lead_team"
                      label="Team hosting the event"
                      options={values?.metadata?.teams}
                      required="Select at least one team hosting the event"
                      placeholder="-- Select team --"
                      aria-label="Select an team"
                      data-test="group-field-lead-team"
                    />
                    <FieldTypeahead
                      name="service"
                      label="Service"
                      required="Select at least one service"
                      options={values?.metadata?.services}
                      placeholder="-- Select service --"
                      aria-label="Select a service"
                      data-test="group-field-service"
                    />
                    <AdviserTypeAhead
                      name="organiser"
                      label="Organiser"
                      required="Type at least one organiser"
                      placeholder="-- Type to search for organiser --"
                      data-test="group-field-organiser"
                    />
                    <FieldRadios
                      legend="Is this a shared event? (optional)"
                      name="event_shared"
                      options={OPTIONS_YES_NO}
                      inline={true}
                      data-test="group-field-event-shared"
                    />
                    {values.event_shared === OPTION_YES && (
                      <FieldAddAnother
                        name="teams"
                        label="Teams"
                        required="Select at least one team"
                        item-name="team"
                        data-test="group-field-teams"
                      >
                        {({ value, onChange, error }) => (
                          <FieldTypeahead
                            name="teams"
                            options={values?.metadata?.teams}
                            placeholder="-- Select team --"
                            required="Select at least one team"
                            aria-label="Select at least one team"
                            value={values?.metadata?.teams?.find(
                              ({ value: option_value }) =>
                                option_value === value
                            )}
                            onChange={onChange}
                            error={error}
                          />
                        )}
                      </FieldAddAnother>
                    )}
                    <FieldAddAnother
                      name="related_programmes"
                      label="Related programmes"
                      required="Select at least one programme"
                      item-name="program"
                      data-test="group-field-related-programmes"
                    >
                      {({ value, onChange, error }) => (
                        <>
                          {/* TODO: remove when done */}
                          {/* {console.log('Related Programme', value)} */}
                          <FieldTypeahead
                            name="related_programmes"
                            options={values?.metadata?.programmes}
                            placeholder="-- Select programme --"
                            required="Select at least one programme"
                            aria-label="Select at least one programme"
                            value={values?.metadata?.programmes?.find(
                              ({ value: option_value }) => {
                                if (value) {
                                  // debugger
                                  return option_value === value
                                }
                              }
                            )}
                            onChange={onChange}
                            error={error}
                          />
                        </>
                      )}
                    </FieldAddAnother>
                    {/* TODO: Remove when done */}
                    {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                  </>
                )
              }
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

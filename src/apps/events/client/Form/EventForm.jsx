import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { Button, Link, LoadingBox } from 'govuk-react'

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
  FormStateful,
  NewWindowLink,
  FormActions,
} from '../../../../client/components'

import Task from '../../../../client/components/Task'
import {
  ID,
  TASK_GET_EVENTS_FORM_METADATA,
  TASK_SAVE_EVENT,
  state2props,
} from './state'
import {
  EVENTS__FORM_METADATA_LOADED,
  ADD_EVENT_FORM__SUBMIT,
} from '../../../../client/actions'
import { addMessage } from '../../../../client/utils/flash-messages'
import { OPTIONS_YES_NO, OPTION_YES } from '../../../../client/constants'

const EventForm = ({
  formData: {
    eventTypeOptions,
    relatedTradeAgreements,
    eventLocationTypes,
    countries,
    teams,
    services,
    programmes,
    ukRegions,
    initialValues,
  },
  isComplete,
  createdEventId,
  createdEventName,
  progress,
  eventId,
  updatedEventId,
  updatedEventName,
}) => {
  // console.log(initialValues)
  const breadcrumbs = [
    {
      link: urls.dashboard(),
      text: 'Home',
    },
    {
      link: urls.events.index(),
      text: 'Events',
    },
  ]
  if (eventId) {
    if (initialValues && initialValues.name) {
      breadcrumbs.push({
        link: urls.events.edit(eventId),
        text: initialValues.name,
      })
    }
    breadcrumbs.push({
      text: 'Edit event',
    })
  } else {
    breadcrumbs.push({
      text: 'Add event',
    })
  }

  useEffect(() => {
    if (createdEventId && createdEventName) {
      addMessage('success', `'${createdEventName}' event has been created`)
      window.location.href = urls.events.details(createdEventId)
    }
  }, [createdEventId, createdEventName])

  useEffect(() => {
    if (updatedEventId && updatedEventName) {
      addMessage('success', `'${updatedEventName}' event has been updated`)
      window.location.href = urls.events.details(updatedEventId)
    }
  }, [updatedEventId, updatedEventName])

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
    if (value) {
      const startDate = getDate(values?.start_date)
      const endDate = getDate(values?.end_date)
      if (startDate && endDate) {
        return
        startDate > endDate
          ? 'Enter a valid end date. This must be after the start date.'
          : null
      }
    }
    return null
  }

  return (
    <>
      <Task>
        {(getTask) => {
          const saveEventFormTask = getTask(TASK_SAVE_EVENT, ID)
          return (
            <>
              <LocalHeader
                breadcrumbs={breadcrumbs}
                heading={eventId ? 'Edit event' : 'Add event'}
              />
              <Main>
                <GridRow data-test="eventForm">
                  <GridCol setWidth="three-quarters">
                    <article>
                      <p data-test="trade-agreement-text">
                        If your Event is set up to focus on a Trade Agreement or
                        contributes to implementing a Trade Agreement then
                        select that the event relates to a Trade Agreement and
                        the relevant Agreement(s)
                      </p>
                      <NewWindowLink
                        href={urls.external.helpCentre.tradeagreementGuidance()}
                        data-test="trade-agreement-link"
                      >
                        See more guidance
                      </NewWindowLink>
                    </article>
                    <Task.Status
                      id={ID}
                      name={TASK_GET_EVENTS_FORM_METADATA}
                      startOnRender={{
                        payload: eventId,
                        onSuccessDispatch: EVENTS__FORM_METADATA_LOADED,
                      }}
                    >
                      {() => {
                        return (
                          isComplete && (
                            <FormStateful
                              id="event-form"
                              initialValues={initialValues}
                              showErrorSummary={true}
                              submissionError={saveEventFormTask.errorMessage}
                              onSubmit={(values) => {
                                saveEventFormTask.start({
                                  payload: {
                                    values,
                                  },
                                  onSuccessDispatch: ADD_EVENT_FORM__SUBMIT,
                                })
                              }}
                            >
                              {({ values }) => (
                                <LoadingBox loading={progress}>
                                  <FieldRadios
                                    legend="Does the event relate to a trade agreement?"
                                    name="has_related_trade_agreements"
                                    required="Answer if the event is related to a trade agreement"
                                    options={OPTIONS_YES_NO}
                                    inline={true}
                                  />
                                  {values.has_related_trade_agreements ===
                                    OPTION_YES && (
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
                                          inputId="related_trade_agreements"
                                          options={relatedTradeAgreements}
                                          placeholder="-- Search trade agreements --"
                                          required="Select at least one Trade Agreement"
                                          aria-label="Select a trade agreement"
                                          value={relatedTradeAgreements.find(
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
                                    inputId="event_type"
                                    label="Type of event"
                                    options={eventTypeOptions}
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
                                    validate={
                                      validatedStartDateBeforeOrEqualToEndDate
                                    }
                                  />
                                  <FieldTypeahead
                                    name="location_type"
                                    label="Event location type (optional)"
                                    inputId="location_type"
                                    options={eventLocationTypes}
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
                                    inputId="address_country"
                                    options={countries}
                                    required="Country may not be null."
                                    placeholder="-- Select country --"
                                    aria-label="Select a country"
                                  />
                                  <FieldTypeahead
                                    name="uk_region"
                                    label="UK Region"
                                    inputId="uk_region"
                                    options={ukRegions}
                                    required="UK region may not be null."
                                    placeholder="-- Select region --"
                                    aria-label="Select a region"
                                  />
                                  <FieldTextarea
                                    type="text"
                                    name="notes"
                                    label="Event Notes (optional)"
                                  />
                                  <FieldTypeahead
                                    name="lead_team"
                                    label="Team hosting the event"
                                    inputId="lead_teams"
                                    options={teams}
                                    required="Select at least one team hosting the event"
                                    placeholder="-- Select team --"
                                    aria-label="Select an team"
                                  />
                                  <FieldTypeahead
                                    name="service"
                                    label="Service"
                                    inputId="service"
                                    required="Select at least one service"
                                    options={services}
                                    placeholder="-- Select service --"
                                    aria-label="Select a service"
                                  />
                                  <AdviserTypeAhead
                                    name="organiser"
                                    label="Organiser"
                                    required="Type at least one organiser"
                                    placeholder="-- Type to search for organiser --"
                                  />
                                  <FieldRadios
                                    legend="Is this a shared event? (optional)"
                                    name="event_shared"
                                    options={OPTIONS_YES_NO}
                                    inline={true}
                                  />
                                  {values.event_shared === OPTION_YES && (
                                    <FieldAddAnother
                                      name="teams"
                                      label="Teams"
                                      required="Select at least one team"
                                      item-name="team"
                                    >
                                      {({ value, onChange, error }) => (
                                        <FieldTypeahead
                                          name="teams"
                                          inputId="teams"
                                          options={teams}
                                          placeholder="-- Select team --"
                                          required="Select at least one team"
                                          aria-label="Select at least one team"
                                          value={teams.find(
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
                                  >
                                    {({ value, onChange, error }) => (
                                      <>
                                        {/* {console.log(value)} */}
                                        <FieldTypeahead
                                          name="related_programmes"
                                          inputId="related_programmes"
                                          options={programmes}
                                          placeholder="-- Select programme --"
                                          required="Select at least one programme"
                                          aria-label="Select at least one programme"
                                          value={programmes.find(
                                            ({ value: option_value }) =>
                                              option_value === value
                                          )}
                                          onChange={onChange}
                                          error={error}
                                        />
                                      </>
                                    )}
                                  </FieldAddAnother>
                                  <FormActions>
                                    <Button>
                                      {eventId
                                        ? 'Save and return'
                                        : 'Add event'}
                                    </Button>
                                    <Link
                                      href={
                                        eventId
                                          ? urls.events.details(eventId)
                                          : urls.events.index()
                                      }
                                    >
                                      Return without saving
                                    </Link>
                                  </FormActions>
                                </LoadingBox>
                              )}
                            </FormStateful>
                          )
                        )
                      }}
                    </Task.Status>
                  </GridCol>
                </GridRow>
              </Main>
            </>
          )
        }}
      </Task>
    </>
  )
}

EventForm.propTypes = {
  formData: PropTypes.shape({
    eventTypeOptions: PropTypes.array,
    relatedTradeAgreements: PropTypes.array,
    eventLocationTypes: PropTypes.array,
    countries: PropTypes.array,
    teams: PropTypes.array,
    services: PropTypes.array,
    programmes: PropTypes.array,
    ukRegions: PropTypes.array,
    initialValues: PropTypes.object,
  }),
  isComplete: PropTypes.bool,
  createdEventId: PropTypes.string,
  createdEventName: PropTypes.string,
  progress: PropTypes.bool,
  updatedEventName: PropTypes.string,
}

export default connect(state2props)(EventForm)

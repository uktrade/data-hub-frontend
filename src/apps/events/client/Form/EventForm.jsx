import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { connect } from 'react-redux'
import { Button, Link } from 'govuk-react'

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
  MultiInstanceForm,
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
import { EVENTS__FORM_METADATA_LOADED } from '../../../../client/actions'

const EventForm = ({
  metadata: {
    eventTypeOptions,
    relatedTradeAgreements,
    eventLocationTypes,
    countries,
    teams,
    services,
    programmes,
  },
  isComplete,
}) => {
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
      text: 'Add event',
    },
  ]

  return (
    <>
      <Task>
        {(getTask) => {
          const saveEventFormTask = getTask(TASK_SAVE_EVENT, ID)
          return (
            <>
              <LocalHeader breadcrumbs={breadcrumbs} heading="Add event" />
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
                        onSuccessDispatch: EVENTS__FORM_METADATA_LOADED,
                      }}
                    >
                      {() => {
                        return (
                          isComplete && (
                            <MultiInstanceForm
                              id="add-event-form"
                              showErrorSummary={true}
                              submissionError={saveEventFormTask.errorMessage}
                              onSubmit={(values) => {
                                saveEventFormTask.start({
                                  payload: {
                                    values,
                                  },
                                  // onSuccessDispatch: ADD_EVENTS_FORM__SUBMIT,
                                })
                              }}
                            >
                              {({ values }) => (
                                <>
                                  {/* {console.log(values)} */}
                                  <FieldRadios
                                    legend="Does the Event relate to a Trade Agreement?"
                                    name="has_related_trade_agreements"
                                    required="Answer if the Event is related to a Trade Agreement"
                                    options={[
                                      { value: 'Yes', label: 'Yes' },
                                      { value: 'No', label: 'No' },
                                    ]}
                                    inline={true}
                                  />
                                  {values.has_related_trade_agreements ===
                                    'Yes' && (
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
                                  />
                                  <FieldTypeahead
                                    name="location_type"
                                    label="Event location type (optional)"
                                    inputId="location_type"
                                    options={eventLocationTypes}
                                    placeholder="-- Select event --"
                                    aria-label="Select an event"
                                  />
                                  {/* TODO: Refactor Address stuff into an Address Component */}
                                  {/* CHECK: Why required is not labeling as expected */}
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
                                    placeholder="-- Select country --"
                                    aria-label="Select a country"
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
                                    label="Service (optional)"
                                    inputId="service"
                                    options={services}
                                    placeholder="-- Select service --"
                                    aria-label="Select a service"
                                  />
                                  <AdviserTypeAhead
                                    name="organiser"
                                    label="Organiser"
                                    required="Select at least one organiser"
                                  />
                                  <FieldRadios
                                    legend="Is this a shared event? (optional)?"
                                    name="event_shared"
                                    options={[
                                      { value: 'Yes', label: 'Yes' },
                                      { value: 'No', label: 'No' },
                                    ]}
                                    inline={true}
                                  />
                                  {values.event_shared === 'Yes' && (
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
                                    )}
                                  </FieldAddAnother>
                                  <FormActions>
                                    <Button>Add event</Button>
                                    {/* TDODO: Cancel URL */}
                                    <Link href="/">Cancel</Link>
                                  </FormActions>
                                </>
                              )}
                            </MultiInstanceForm>
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

export default connect(state2props)(EventForm)

import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import styled from 'styled-components'
import { FONT_WEIGHTS, LINE_HEIGHT } from '@govuk-react/constants'
import { connect } from 'react-redux'

import urls from '../../../../lib/urls'
import LocalHeader from '../../../../client/components/LocalHeader/LocalHeader.jsx'
import {
  AdviserTypeAhead,
  FieldRadios,
  FieldInput,
  FieldDate,
  FieldAddAnother,
  FieldTextarea,
  Main,
  MultiInstanceForm,
  NewWindowLink,
  Typeahead,
} from '../../../../client/components'
import FieldWrapper from '../../../../client/components/Form/elements/FieldWrapper'
import Task from '../../../../client/components/Task'
import { ID, TASK_GET_EVENTS_FORM_METADATA, state2props } from './state'
import { EVENTS__FORM_METADATA_LOADED } from '../../../../client/actions'

const StyledFieldWrapper = styled(FieldWrapper)`
  label {
    font-weight: ${FONT_WEIGHTS.bold};
    line-height: ${LINE_HEIGHT.SIZE_16};
  }
`
const EventForm = ({
  metadata: {
    eventTypeOptions,
    relatedTradeAgreements,
    eventLocationTypes,
    countries,
    teams,
    services,
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
        {() => {
          // const eventsFormMetadataTask = getTask(
          //   TASK_GET_EVENTS_FORM_METADATA,
          //   ID
          // )
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
                            >
                              {({ values }) => (
                                <>
                                  {/* {console.log(values)} */}
                                  <FieldRadios
                                    legend="Does the Event relate to a Trade Agreement?"
                                    name="has_related_trade_agreements"
                                    required="This field is required."
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
                                        <Typeahead
                                          name="related_trade_agreements"
                                          inputId="related_trade_agreements"
                                          label=""
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
                                    required="This field may not be null."
                                    data-test="group-field-name"
                                  />
                                  <StyledFieldWrapper
                                    label="Type of event"
                                    name=""
                                    hint=""
                                  >
                                    <Typeahead
                                      name="event_type"
                                      inputId="event_type"
                                      options={eventTypeOptions}
                                      placeholder="-- Select event type --"
                                      required="Select at least one event type"
                                      aria-label="Select an event type"
                                    />
                                  </StyledFieldWrapper>
                                  <FieldDate
                                    name="start_date"
                                    label="Event start date"
                                    required="Enter a valid date"
                                  />
                                  <FieldDate
                                    name="end_date"
                                    label="Event end date"
                                    required="Enter a valid date"
                                  />
                                  <StyledFieldWrapper
                                    label="Event location type (optional)"
                                    name=""
                                    hint=""
                                  >
                                    <Typeahead
                                      name="location_type"
                                      inputId="location_type"
                                      options={eventLocationTypes}
                                      placeholder="-- Select event --"
                                      aria-label="Select an event"
                                    />
                                  </StyledFieldWrapper>
                                  {/* TODO: Refactor Address stuff into an Address Component */}
                                  {/* CHECK: Why required is not labeling as expected */}
                                  <FieldInput
                                    label="Business and street"
                                    name="address_1"
                                    type="text"
                                    required="This field may not be null."
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
                                    required="This field may not be null."
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
                                    required="This field may not be null."
                                    data-test="group-field-address_postcode"
                                  />
                                  <StyledFieldWrapper
                                    label="Country"
                                    name=""
                                    hint=""
                                  >
                                    <Typeahead
                                      name="address_country"
                                      inputId="address_country"
                                      options={countries}
                                      placeholder="-- Select country --"
                                      aria-label="Select a country"
                                    />
                                  </StyledFieldWrapper>
                                  <FieldTextarea
                                    type="text"
                                    name="notes"
                                    label="Event Notes (optional)"
                                  />
                                  <StyledFieldWrapper
                                    label="Team hosting the event"
                                    name=""
                                    hint=""
                                  >
                                    <Typeahead
                                      name="teams"
                                      inputId="teams"
                                      options={teams}
                                      required="Select at least one team hosting the event"
                                      placeholder="-- Select team --"
                                      aria-label="Select an team"
                                    />
                                  </StyledFieldWrapper>
                                  <StyledFieldWrapper
                                    label="Service (optional)"
                                    name=""
                                    hint=""
                                  >
                                    <Typeahead
                                      name="service"
                                      inputId="service"
                                      options={services}
                                      placeholder="-- Select service --"
                                      aria-label="Select a service"
                                    />
                                  </StyledFieldWrapper>
                                  <AdviserTypeAhead
                                    name="organiser"
                                    label="Organiser"
                                    required="Select at least one organiser"
                                  />
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

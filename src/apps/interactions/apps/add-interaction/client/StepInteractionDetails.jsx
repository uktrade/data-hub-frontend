import React from 'react'
import { H3 } from '@govuk-react/heading'
import moment from 'moment'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'
import axios from 'axios'
import {
  FieldCheckboxes,
  FieldDate,
  FieldInput,
  FieldRadios,
  FieldSelect,
  FieldTextarea,
  FieldTypeahead,
  useFormContext,
} from 'data-hub-components'

import {
  SERVICE_CONTEXTS,
  SERVICE_DELIVERY_STATUS_COMPLETED,
  THEMES,
  KINDS,
} from '../../../constants'

import {
  EXPORT_INTEREST_STATUS,
  EXPORT_INTEREST_STATUS_VALUES,
} from '../../../../constants'

import getInteractionKind from './utils'

const getServiceContext = (values) => {
  switch (values.theme) {
    case THEMES.EXPORT:
      return values.kind_export
    case THEMES.INVESTMENT:
      return SERVICE_CONTEXTS.INVESTMENT_INTERACTION
    case THEMES.OTHER:
      return values.kind_other
    default:
      return null
  }
}

const isTapService = (service) => service?.label?.includes('(TAP)')

const filterServices = (services, values) =>
  services.filter((s) => s.contexts.includes(getServiceContext(values)))

const validateRequiredCountries = (countries, field, { values }) =>
  !EXPORT_INTEREST_STATUS_VALUES.some((status) => values[status])
    ? 'Select at least one country in one of the three fields'
    : null

const validatedDuplicatedCountries = (countries, field, { values }) =>
  EXPORT_INTEREST_STATUS_VALUES.filter((status) => status !== field.name).some(
    (status) =>
      countries &&
      values[status] &&
      countries.some((country) => values[status].includes(country))
  )
    ? 'A country that was discussed cannot be entered in multiple fields'
    : null

const OPTION_YES = 'yes'
const OPTION_NO = 'no'
const OPTIONS_YES_NO = [
  { label: 'Yes', value: OPTION_YES },
  { label: 'No', value: OPTION_NO },
]

const StepInteractionDetails = ({
  contacts,
  defaultAdviser,
  services,
  serviceDeliveryStatuses,
  policyAreas,
  policyIssueTypes,
  communicationChannels,
  countries,
  activeEvents,
}) => {
  const { values = {} } = useFormContext()

  const today = moment()

  const filteredServices = filterServices(services, values)
  const selectedService = services.find(
    (s) => s.value === values.service?.value
  )
  const isServiceDelivery =
    getInteractionKind(values) === KINDS.SERVICE_DELIVERY

  return (
    <>
      <H3 as="h2">Service</H3>

      <FieldTypeahead
        name="service"
        placeholder="-- Select service --"
        options={filteredServices}
        required="Select a service"
      />

      {selectedService?.interaction_questions?.map((question) => (
        <FieldRadios
          name={`service_answers[${question.id}]`}
          label={question.name}
          required={`Give answer to "${question.name}"`}
          options={question.answer_options.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
        />
      ))}

      {isServiceDelivery && isTapService(selectedService) && (
        <>
          <FieldSelect
            label="Service status (optional)"
            name="service_delivery_status"
            emptyOption="-- Select service status --"
            options={serviceDeliveryStatuses}
          />
          <FieldInput
            type="text"
            label="Grant offered (optional)"
            name="grant_amount_offered"
          />
          {values.service_delivery_status ===
            SERVICE_DELIVERY_STATUS_COMPLETED && (
            <FieldInput
              type="text"
              label="Net receipt (optional)"
              name="net_company_receipt"
            />
          )}
        </>
      )}

      <H3 as="h2">Participants</H3>

      <FieldTypeahead
        name="contacts"
        label="Contact(s)"
        placeholder="-- Select contact --"
        required="Select at least one contact"
        options={contacts}
        isMulti={true}
      />

      <FieldTypeahead
        name="advisers"
        label="Adviser(s)"
        placeholder="-- Select adviser --"
        required="Select at least one adviser"
        loadOptions={throttle(
          (searchString) =>
            axios
              .get('/api-proxy/adviser/', {
                params: {
                  autocomplete: searchString,
                },
              })
              .then(({ data: { results } }) =>
                results
                  .filter((adviser) => adviser?.name.trim().length)
                  .map(({ id, name, dit_team }) => ({
                    label: `${name}${dit_team ? ', ' + dit_team.name : ''}`,
                    value: id,
                  }))
              ),
          500
        )}
        initialValue={[defaultAdviser]}
        defaultValue={[defaultAdviser]}
        isMulti={true}
      />

      <H3 as="h2">Details</H3>

      <FieldDate
        name="date"
        label="Date of interaction"
        required="Enter a valid date"
        initialValue={{
          day: today.format('DD'),
          month: today.format('MM'),
          year: today.format('YYYY'),
        }}
      />

      {!isServiceDelivery && (
        <FieldTypeahead
          name="communication_channel"
          label="Communication channel"
          options={communicationChannels}
          placeholder="-- Select communication channel --"
          required="Select a communication channel"
        />
      )}

      {isServiceDelivery && (
        <>
          <FieldRadios
            inline={true}
            name="is_event"
            label="Is this an event?"
            options={OPTIONS_YES_NO}
            required="Answer if this was an event"
          />
          {values.is_event === OPTION_YES && (
            <FieldTypeahead
              label="Event"
              name="event"
              placeholder="-- Select event --"
              required="Select a specific event"
              options={activeEvents}
            />
          )}
        </>
      )}

      <H3 as="h2">Notes</H3>

      <FieldInput
        type="text"
        name="subject"
        label="Subject"
        required="Enter a subject"
      />

      <FieldTextarea type="text" name="notes" label="Notes (optional)" />

      <FieldRadios
        inline={true}
        name="was_policy_feedback_provided"
        label="Did the contact give any feedback on government policy?"
        options={OPTIONS_YES_NO}
        required="Answer if the contact gave any feedback on government policy"
      />

      {values.was_policy_feedback_provided === OPTION_YES && (
        <>
          <FieldCheckboxes
            name="policy_issue_types"
            label="Policy issue types"
            options={policyIssueTypes}
            required="Select at least one policy issue type"
          />
          <FieldTypeahead
            isMulti={true}
            name="policy_areas"
            label="Policy area(s)"
            placeholder="-- Select policy area --"
            options={policyAreas}
            required="Select at least one policy area"
          />
          <FieldTextarea
            name="policy_feedback_notes"
            label="Policy feedback notes"
            required="Enter policy feedback notes"
            hint="These notes will be visible to other Data Hub users and may be shared within the department"
          />
        </>
      )}

      {values.theme !== THEMES.INVESTMENT && (
        <>
          <FieldRadios
            inline={true}
            name="were_countries_discussed"
            label="Were any countries discussed?"
            required="Answer if any of the countries were discussed"
            options={OPTIONS_YES_NO}
          />
          {values.were_countries_discussed === OPTION_YES && (
            <>
              <FieldTypeahead
                name={EXPORT_INTEREST_STATUS.EXPORTING_TO}
                label="Countries currently exporting to"
                hint="Add all that you discussed"
                placeholder="-- Search countries --"
                options={countries}
                validate={[
                  validateRequiredCountries,
                  validatedDuplicatedCountries,
                ]}
                isMulti={true}
              />
              <FieldTypeahead
                name={EXPORT_INTEREST_STATUS.FUTURE_INTEREST}
                label="Future countries of interest"
                hint="Add all that you discussed"
                placeholder="-- Search countries --"
                options={countries}
                validate={[
                  validateRequiredCountries,
                  validatedDuplicatedCountries,
                ]}
                isMulti={true}
              />
              <FieldTypeahead
                name={EXPORT_INTEREST_STATUS.NOT_INTERESTED}
                label="Countries not interested in"
                hint="Add all that you discussed"
                placeholder="-- Search countries --"
                options={countries}
                validate={[
                  validateRequiredCountries,
                  validatedDuplicatedCountries,
                ]}
                isMulti={true}
              />
            </>
          )}
        </>
      )}
    </>
  )
}

const typeaheadOptionProp = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
})

const typeaheadOptionsListProp = PropTypes.arrayOf(typeaheadOptionProp)

StepInteractionDetails.propTypes = {
  defaultAdviser: typeaheadOptionProp.isRequired,
  services: typeaheadOptionsListProp.isRequired,
  serviceDeliveryStatuses: typeaheadOptionsListProp.isRequired,
  policyAreas: typeaheadOptionsListProp.isRequired,
  policyIssueTypes: typeaheadOptionsListProp.isRequired,
  communicationChannels: typeaheadOptionsListProp.isRequired,
  countries: typeaheadOptionsListProp.isRequired,
  activeEvents: typeaheadOptionsListProp.isRequired,
}

export default StepInteractionDetails

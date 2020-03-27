import React from 'react'
import PropTypes from 'prop-types'
import { H3 } from '@govuk-react/heading'
import moment from 'moment'

import {
  FieldRadios,
  FieldSelect,
  FieldInput,
  FormStateful,
  Step,
  FieldCheckboxes,
  FieldTypeahead,
  FieldTextarea,
} from 'data-hub-components'

import FieldDate from 'data-hub-components/dist/forms/elements/FieldDate'

import {
  THEMES,
  SERVICE_CONTEXTS,
  SERVICE_DELIVERY_STATUS_COMPLETED,
} from '../../../constants'
import InteractionTypeStep from './InteractionTypeStep'

const onSubmit = () => {}

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

const validateCountries = (value, field, { values }) =>
  !values.countries_currently_exporting &&
  !values.countries_future_interest &&
  !values.countries_not_interested_in
    ? 'Select at least one country in one of the three fields'
    : null

const OPTION_YES = 'yes'
const OPTION_NO = 'no'
const OPTIONS_YES_NO = [
  { label: 'Yes', value: OPTION_YES },
  { label: 'No', value: OPTION_NO },
]

const AddInteractionForm = ({
  contacts,
  advisers,
  defaultAdviser,
  services,
  serviceDeliveryStatuses,
  policyAreas,
  policyIssueTypes,
  communicationChannels,
  countries,
  activeEvents,
  csrfToken,
}) => {
  const today = moment()
  return (
    <FormStateful
      initialValues={{
        date: {
          day: today.format('DD'),
          month: today.format('MM'),
          year: today.format('YYYY'),
        },
        advisers: [defaultAdviser],
      }}
      onSubmit={(values) => onSubmit(values, csrfToken)}
    >
      {({ values }) => {
        const filteredServices = filterServices(services, values)
        const selectedService = services.find(
          (s) => s.value === values.service?.value
        )
        const isServiceDelivery =
          (values.theme === THEMES.EXPORT &&
            values.kind_export === SERVICE_CONTEXTS.EXPORT_SERVICE_DELIVERY) ||
          (values.theme === THEMES.OTHER &&
            values.kind_other === SERVICE_CONTEXTS.OTHER_SERVICE_DELIVERY)

        return (
          <>
            <InteractionTypeStep />

            <Step name="interaction_details" forwardButton="Add interaction">
              <H3 as="h2">Service</H3>

              <FieldTypeahead
                name="service"
                placeholder="-- Select service --"
                options={filteredServices}
                required="Select a service"
              />

              {selectedService?.interaction_questions?.map((question) => (
                <FieldRadios
                  name={question.id}
                  label={question.name}
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
                options={advisers}
                isMulti={true}
              />

              <H3 as="h2">Details</H3>

              <FieldDate
                name="date"
                label="Date of interaction"
                required="Enter a valid date"
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

              <FieldTextarea
                type="text"
                name="notes"
                label="Notes (optional)"
              />

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
                    label="Policy feedback notes (optional)"
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
                        name="countries_currently_exporting"
                        label="Countries currently exporting to"
                        hint="Add all that you discussed"
                        placeholder="-- Search countries --"
                        options={countries}
                        validate={validateCountries}
                        isMulti={true}
                      />
                      <FieldTypeahead
                        name="countries_future_interest"
                        label="Future countries of interest"
                        hint="Add all that you discussed"
                        placeholder="-- Search countries --"
                        options={countries}
                        validate={validateCountries}
                        isMulti={true}
                      />
                      <FieldTypeahead
                        name="countries_not_interested_in"
                        label="Countries not interested in"
                        hint="Add all that you discussed"
                        placeholder="-- Search countries --"
                        options={countries}
                        validate={validateCountries}
                        isMulti={true}
                      />
                    </>
                  )}
                </>
              )}
            </Step>

            <pre>
              <code>{JSON.stringify(values, null, 2)}</code>
            </pre>
            <br />
          </>
        )
      }}
    </FormStateful>
  )
}

const typeaheadOptionProp = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
})

const typeaheadOptionsListProp = PropTypes.arrayOf(typeaheadOptionProp)

AddInteractionForm.propTypes = {
  advisers: typeaheadOptionsListProp.isRequired,
  defaultAdviser: typeaheadOptionProp.isRequired,
  services: typeaheadOptionsListProp.isRequired,
  serviceDeliveryStatuses: typeaheadOptionsListProp.isRequired,
  policyAreas: typeaheadOptionsListProp.isRequired,
  policyIssueTypes: typeaheadOptionsListProp.isRequired,
  communicationChannels: typeaheadOptionsListProp.isRequired,
  countries: typeaheadOptionsListProp.isRequired,
  activeEvents: typeaheadOptionsListProp.isRequired,
  csrfToken: PropTypes.string.isRequired,
}

export default AddInteractionForm
